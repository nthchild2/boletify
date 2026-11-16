/**
 * Transactional email via Resend.
 *
 * Without RESEND_API_KEY nothing is sent: the email is logged, and outside
 * production the rendered HTML is written to <tmpdir>/boletify-emails so it
 * can be opened in a browser. Sending never throws — a failed email must not
 * break checkout or the Stripe webhook.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Resend } from 'resend';

export type OutgoingEmail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Lets Resend drop duplicates if the same email is sent twice. */
  idempotencyKey?: string;
};

export type SendResult = { sent: boolean; id?: string; previewPath?: string; error?: string };

let _resend: Resend | null = null;

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function fromAddress(): string {
  // Resend's shared sender only delivers to the account owner's address;
  // set EMAIL_FROM to an address on a verified domain for real buyers.
  return process.env.EMAIL_FROM || 'Boletify <onboarding@resend.dev>';
}

async function writePreview(email: OutgoingEmail): Promise<string | undefined> {
  if (process.env.NODE_ENV === 'production') return undefined;
  try {
    const dir = join(tmpdir(), 'boletify-emails');
    await mkdir(dir, { recursive: true });
    const safeTo = email.to.replace(/[^a-z0-9@._-]/gi, '_');
    const path = join(dir, `${new Date().toISOString().replace(/[:.]/g, '-')}-${safeTo}.html`);
    await writeFile(path, email.html, 'utf8');
    return path;
  } catch {
    return undefined;
  }
}

export async function sendEmail(email: OutgoingEmail): Promise<SendResult> {
  if (!isEmailConfigured()) {
    const previewPath = await writePreview(email);
    console.info(
      `[email] RESEND_API_KEY not set — not sent: "${email.subject}" to ${email.to}` +
        (previewPath ? ` (preview: ${previewPath})` : ''),
    );
    return { sent: false, previewPath };
  }

  try {
    _resend ??= new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await _resend.emails.send(
      {
        from: fromAddress(),
        to: email.to,
        subject: email.subject,
        html: email.html,
        text: email.text,
        replyTo: process.env.EMAIL_REPLY_TO || undefined,
      },
      email.idempotencyKey ? { idempotencyKey: email.idempotencyKey } : undefined,
    );
    if (error) {
      console.error('[email] Resend rejected the email', email.subject, error);
      return { sent: false, error: error.message };
    }
    return { sent: true, id: data?.id };
  } catch (err) {
    console.error('[email] send failed', email.subject, err);
    return { sent: false, error: err instanceof Error ? err.message : String(err) };
  }
}
