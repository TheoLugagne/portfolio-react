import type { AuthResponse, MeResponse, User } from '../types';
import { apiClient } from './apiClient';

const TOKEN_KEY = 'auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function loginWithGoogle(credential: string): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/api/auth/google', {
    method: 'POST',
    body: { credential },
  });
}

export async function fetchCurrentUser(token: string): Promise<User> {
  const { user } = await apiClient<MeResponse>('/api/auth/me', { token });
  return user;
}
