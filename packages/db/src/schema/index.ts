import { pgTable, serial, text, timestamp, integer, boolean, pgEnum, decimal, uuid, index } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  role: text('role').notNull().default('buyer'), // 'buyer' | 'organiser' | 'admin'
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Organiser profiles (extends users with organiser-specific data)
export const organiserProfiles = pgTable('organiser_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  organiserName: text('organiser_name').notNull(),
  bio: text('bio'),
  logoUrl: text('logo_url'),
  slug: text('slug').notNull().unique(), // for URLs like boletify.com/o/{slug}
  stripeConnectId: text('stripe_connect_id'), // Stripe Connect account ID
  conektaClientId: text('conekta_client_id'), // Conekta client ID
  payoutBank_clabe: text('payout_bank_clabe'), // encrypted
  payoutBank_name: text('payout_bank_name'),
  payoutSchedule_days: integer('payout_schedule_days').default(3), // T+3
  isApproved: boolean('is_approved').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Events table
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  organiserId: integer('organiser_id').notNull().references(() => organiserProfiles.id),
  title: text('title').notNull(),
  slug: text('slug').notNull(), // for URLs
  description: text('description'),
  coverImageUrl: text('cover_image_url'),
  venueName: text('venue_name').notNull(),
  venueAddress: text('venue_address'),
  venueMapUrl: text('venue_map_url'), // Google Maps link
  city: text('city').notNull().default('CDMX'),
  genreTags: text('genre_tags').array(), // ['indie', 'electronic', 'rock']
  status: text('status').notNull().default('draft'), // 'draft' | 'published' | 'cancelled' | 'ended' | 'deleted'
  publishedAt: timestamp('published_at'),
  cancelledAt: timestamp('cancelled_at'),
  cancelledReason: text('cancelled_reason'),
  deletedAt: timestamp('deleted_at'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  organiserIdx: index('events_organiser_id_idx').on(table.organiserId),
  statusIdx: index('events_status_idx').on(table.status),
  slugIdx: index('events_slug_idx').on(table.slug),
}));

// Ticket tiers table
export const ticketTiers = pgTable('ticket_tiers', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').notNull().references(() => events.id),
  name: text('name').notNull(), // 'General', 'VIP', 'Early Bird'
  description: text('description'),
  price: integer('price').notNull().default(0), // in MXN cents
  quantity: integer('quantity').notNull(), // total available
  sold: integer('sold').notNull().default(0),
  maxPerOrder: integer('max_per_order').default(10),
  saleStartDate: timestamp('sale_start_date'),
  saleEndDate: timestamp('sale_end_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Orders table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(), // e.g. "BOL-2024-000001"
  eventId: integer('event_id').notNull().references(() => events.id),
  buyerEmail: text('buyer_email').notNull(),
  buyerName: text('buyer_name'),
  status: text('status').notNull().default('pending'), // 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled'
  subtotal: integer('subtotal').notNull(), // before fees
  serviceFee: integer('service_fee').notNull(), // Boletify fee
  paymentProcessingFee: integer('payment_processing_fee').notNull(), // Stripe/OXXO fee
  oxxoFee: integer('oxxo_fee').default(0), // OXXO convenience fee
  total: integer('total').notNull(),
  paymentMethod: text('payment_method'), // 'card' | 'oxxo' | 'mercadopago'
  paymentIntentId: text('payment_intent_id'), // Stripe payment intent
  oxxoReference: text('oxxo_reference'), // OXXO reference
  oxxoExpiresAt: timestamp('oxxo_expires_at'),
  mercadopagoPreferenceId: text('mercadopagoPreference_id'),
 MercadopagoPaymentId: text('mercadopago_payment_id'),
  stripeSessionId: text('stripe_session_id'),
  promoCodeId: integer('promo_code_id'), // FK to promo codes
  discountAmount: integer('discount_amount').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  eventIdx: index('orders_event_id_idx').on(table.eventId),
  buyerIdx: index('orders_buyer_email_idx').on(table.buyerEmail),
  statusIdx: index('orders_status_idx').on(table.status),
}));

// Tickets table (individual tickets per order)
export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull().references(() => orders.id),
  ticketTierId: integer('ticket_tier_id').notNull().references(() => ticketTiers.id),
  ticketNumber: text('ticket_number').notNull().unique(), // e.g. "TKT-ABC123"
  qrCode: text('qr_code').notNull(), // QR code data (HMAC signed)
  status: text('status').notNull().default('valid'), // 'valid' | 'used' | 'refunded' | 'cancelled'
  checkedInAt: timestamp('checked_in_at'),
  checkedInBy: text('checked_in_by'), // organiser user name
  attendeeName: text('attendee_name'),
  attendeeEmail: text('attendee_email'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  orderIdx: index('tickets_order_id_idx').on(table.orderId),
  tierIdx: index('tickets_tier_id_idx').on(table.ticketTierId),
  qrIdx: index('tickets_qr_code_idx').on(table.qrCode),
}));

// Payments table
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull().references(() => orders.id),
  provider: text('provider').notNull(), // 'stripe' | 'oxxo' | 'mercadopago'
  providerPaymentId: text('provider_payment_id').notNull(),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull().default('MXN'),
  status: text('status').notNull().default('pending'), // 'pending' | 'succeeded' | 'failed' | 'refunded'
  webhookData: text('webhook_data'), // JSON string of webhook payload
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Promo codes table
export const promoCodes = pgTable('promo_codes', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').notNull().references(() => events.id),
  code: text('code').notNull(),
  discountType: text('discount_type').notNull(), // 'percentage' | 'flat'
  discountValue: integer('discount_value').notNull(), // % (1-100) or MXN cents
  maxUses: integer('max_uses'),
  usesCount: integer('uses_count').notNull().default(0),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  eventIdx: index('promo_codes_event_id_idx').on(table.eventId),
  codeIdx: index('promo_codes_code_idx').on(table.code),
}));

// Sessions table (Auth.js)
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  expiresAt: timestamp('expires_at'),
});

// Accounts table (Auth.js - OAuth)
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
});

// Verification tokens (Auth.js - email verification)
export const verificationTokens = pgTable('verification_tokens', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires').notNull(),
});

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type OrganiserProfile = typeof organiserProfiles.$inferSelect;
export type Event = typeof events.$inferSelect;
export type TicketTier = typeof ticketTiers.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Ticket = typeof tickets.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type PromoCode = typeof promoCodes.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Account = typeof accounts.$inferSelect;