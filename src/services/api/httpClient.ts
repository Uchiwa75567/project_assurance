import type { ApiEnvelope } from '../../shared/types/api.types';
import { ApiError } from '../../shared/types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';
let csrfTokenCache: string | null = null;

type RequestOptions = Omit<RequestInit, 'body' | 'headers' | 'method'> & {
  body?: unknown;
  headers?: HeadersInit;
  method?: string;
};

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

async function ensureCsrfCookie(): Promise<string | null> {
  const fromCookie = getCookie('XSRF-TOKEN');
  if (fromCookie) {
    csrfTokenCache = fromCookie;
    return fromCookie;
  }

  const response = await fetch(`${API_BASE_URL}/auth/csrf`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) return null;

  const payload = (await response.json().catch(() => null)) as
    | { data?: { token?: string }; token?: string }
    | null;

  const token = payload?.data?.token ?? payload?.token ?? getCookie('XSRF-TOKEN');
  csrfTokenCache = token ?? null;
  return csrfTokenCache;
}

async function request<T>(path: string, init?: RequestOptions): Promise<T> {
  const method = (init?.method ?? 'GET').toUpperCase();
  const isMutation = method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS';
  const body = init?.body;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  let csrfToken: string | null = csrfTokenCache ?? getCookie('XSRF-TOKEN');
  if (isMutation) {
    csrfToken = await ensureCsrfCookie();
  }

  const requestBody: BodyInit | null | undefined = isFormData
    ? (body as FormData)
    : body === undefined
      ? undefined
      : typeof body === 'string'
        ? body
        : JSON.stringify(body);

  const headers: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(isMutation && csrfToken
      ? {
          'X-XSRF-TOKEN': csrfToken,
          'X-CSRF-TOKEN': csrfToken,
        }
      : {}),
    ...(init?.headers ?? {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers,
    body: requestBody,
  });

  const text = await response.text();
  let parsed: ApiEnvelope<T> | null = null;

  if (text) {
    try {
      parsed = JSON.parse(text) as ApiEnvelope<T>;
    } catch {
      parsed = null;
    }
  }

  if (!response.ok) {
    throw new ApiError(parsed?.message ?? 'Une erreur est survenue.', response.status, parsed);
  }

  return (parsed?.data ?? null) as T;
}

export const httpClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'POST',
      body,
    }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body,
    }),
};

export { API_BASE_URL, ApiError };
