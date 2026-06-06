import type { User } from './user';

export interface ApiError {
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface MeResponse {
  user: User;
}
