/**
 * API helper for authenticated requests from the native app.
 * Wraps fetch with the Bearer token from AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'boletify_auth_token';

function getApiUrl() {
  return process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
}

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

type FetchOptions = {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
};

/**
 * Make an authenticated API request.
 * Automatically adds Bearer token and Content-Type headers.
 * Throws on non-2xx responses with the error message from the API.
 */
export async function apiFetch<T = any>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const token = await getToken();
  const { method = 'GET', body, headers = {} } = options;

  const res = await fetch(`${getApiUrl()}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`);
  }

  return data as T;
}
