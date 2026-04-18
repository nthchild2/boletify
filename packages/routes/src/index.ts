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
  ACCOUNT: '/account',

  // Organiser - Dashboard
  ORGANIZER_DASHBOARD: '/dashboard',
  ORGANIZER_EVENTS: '/dashboard/events',
  ORGANIZER_CREATE_EVENT: '/dashboard/events/create',
  ORGANIZER_EDIT_EVENT: (id: string) => `/dashboard/events/${id}/edit`,
  ORGANIZER_ORDERS: '/dashboard/orders',
  ORGANIZER_TICKETS: '/dashboard/tickets',
} as const;

export type DynamicRoute = (id: string) => string;

export type RouteKey = keyof typeof Routes;

export function createRoute(key: RouteKey): string {
  return Routes[key] as string;
}

export default Routes;