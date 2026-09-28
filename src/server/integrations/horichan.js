import { config } from '../config.js';

/**
 * Server-only boundary for Horichan's management API.
 * Keep authorization checks in the API, not in browser code.
 * This intentionally fails closed until a trusted API is configured.
 */
export function isHorichanApiConfigured() {
  return Boolean(config.HORICHAN_API_BASE_URL && config.HORICHAN_API_TOKEN);
}

export async function horichanRequest(path, options = {}) {
  if (!isHorichanApiConfigured()) {
    const error = new Error('Horichan management API is not configured.');
    error.code = 'HORICHAN_API_NOT_CONFIGURED';
    throw error;
  }

  const base = config.HORICHAN_API_BASE_URL.replace(/\/$/, '');
  const safePath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${base}${safePath}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${config.HORICHAN_API_TOKEN}`,
      ...(options.headers ?? {}),
    },
    signal: options.signal ?? AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const error = new Error(`Horichan API request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }
  if (response.status === 204) return null;
  return response.json();
}
