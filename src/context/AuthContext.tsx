import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { User } from '../types';
import {
  clearStoredToken,
  fetchCurrentUser,
  getStoredToken,
  loginWithGoogle as apiLoginWithGoogle,
  setStoredToken,
} from '../services/authService';
import { setUnauthorizedHandler } from '../services/apiClient';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

export interface AuthState {
  user: User | null;
  token: string | null;
  status: AuthStatus;
}

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING' };

function getInitialState(): AuthState {
  const token = getStoredToken();
  return {
    user: null,
    token,
    status: token ? 'loading' : 'idle',
  };
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
    case 'SET_LOADING':
      return { ...state, status: 'loading' };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload.user,
        token: action.payload.token,
        status: 'authenticated',
      };
    case 'LOGIN_ERROR':
      return { user: null, token: null, status: 'error' };
    case 'LOGOUT':
      return { user: null, token: null, status: 'idle' };
    default:
      return state;
  }
}

export interface AuthContextValue {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, undefined, getInitialState);

  const logout = useCallback(() => {
    clearStoredToken();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const loginWithGoogle = useCallback(async (credential: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const { user, token } = await apiLoginWithGoogle(credential);
      setStoredToken(token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    } catch {
      clearStoredToken();
      dispatch({ type: 'LOGIN_ERROR' });
      throw new Error('Google sign-in failed');
    }
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  useEffect(() => {
    const token = state.token;
    if (!token || state.status !== 'loading' || state.user) {
      return;
    }

    let cancelled = false;

    async function restoreSession() {
      try {
        const user = await fetchCurrentUser(token!);
        if (!cancelled) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, token: token! },
          });
        }
      } catch {
        if (!cancelled) {
          clearStoredToken();
          dispatch({ type: 'LOGOUT' });
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, [state.token, state.status, state.user]);

  const value = useMemo(
    () => ({ state, dispatch, loginWithGoogle, logout }),
    [state, loginWithGoogle, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
