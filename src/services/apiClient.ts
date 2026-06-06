import type { ApiError } from '../types';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

export class ApiClientError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(status: number, body: ApiError) {
    super(body.message);
    this.status = status;
    this.fieldErrors = body.fieldErrors;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  token?: string | null;
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, token, headers: customHeaders, ...rest } = options;

  const headers: HeadersInit = {
    ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...customHeaders,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({
      message: response.statusText,
    }))) as ApiError;

    if (response.status === 401 && onUnauthorized) {
      onUnauthorized();
    }

    throw new ApiClientError(response.status, errorBody);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
