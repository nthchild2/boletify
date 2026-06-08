export const Routes = {
  // Debug
  DEBUG: '/debug',

  // Buyer - Home / Discovery
  HOME: '/',
  EVENTS: '/events',
  EVENT_DETAIL: (id: string) => `/events/${id}`,
  SEARCH: '/search',

  // Buyer - Purchase Flow
  CHECKOUT: (eventId: string) => `/checkout/${eventId}`,
  ORDER_CONFIRMATION: (orderId: string) => `/order/${orderId}`,

  // Buyer - My Tickets
  MY_TICKETS: '/tickets',
  TICKET_DETAIL: (orderId: string) => `/tickets/${orderId}`,

  // Buyer - Account
  AUTH_SIGNIN: '/auth/signin',
  AUTH_SIGNUP: '/auth/signup',
  AUTH_SIGNUP_ORGANISER: '/auth/signup/organiser',
  ACCOUNT: '/account',

  // Organiser - Dashboard (protected under /org/ by middleware)
  ORGANIZER_DASHBOARD: '/org/dashboard',
  ORGANIZER_EVENTS: '/org/events',
  ORGANIZER_CREATE_EVENT: '/org/events/create',
  ORGANIZER_EDIT_EVENT: (id: string) => `/org/events/${id}/edit`,
  ORGANIZER_EVENT_DETAIL: (id: string) => `/org/events/${id}`,
  ORGANIZER_ORDERS: '/org/orders',
  ORGANIZER_SETTINGS: '/org/settings',
} as const;

export type DynamicRoute = (id: string) => string;

export type RouteKey = keyof typeof Routes;

export function createRoute(key: RouteKey): string {
  return Routes[key] as string;
}

export default Routes;

export {
  deriveSaleStatus,
  formatMxnPrice,
  type SaleStatus,
  type SaleStatusInput,
  type SaleStatusVariant,
} from "./sale-status";