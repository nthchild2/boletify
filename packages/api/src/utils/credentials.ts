export interface CredentialInput {
  email: string;
  password: string;
}

export async function validateCredentials(
  credentials: CredentialInput,
  storedHash: string | null
): Promise<boolean> {
  if (!storedHash) {
    return false;
  }

  const { verifyPassword } = await import('./password');
  try {
    return await verifyPassword(credentials.password, storedHash);
  } catch {
    return false;
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.toLowerCase());
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}