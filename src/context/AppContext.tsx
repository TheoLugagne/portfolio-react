import {
  createContext,
  useReducer,
  useMemo,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { Contact, Project, Testimonial } from '../types';

export interface AppUiState {
  toasts: Array<{ id: string; message: string; type: 'success' | 'error' }>;
}

export interface AppState {
  projects: Project[];
  contacts: Contact[];
  testimonials: Testimonial[];
  ui: AppUiState;
}

export type AppAction =
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_CONTACTS'; payload: Contact[] }
  | { type: 'SET_TESTIMONIALS'; payload: Testimonial[] }
  | {
      type: 'ADD_TOAST';
      payload: { id: string; message: string; type: 'success' | 'error' };
    }
  | { type: 'REMOVE_TOAST'; payload: string };

const initialState: AppState = {
  projects: [],
  contacts: [],
  testimonials: [],
  ui: { toasts: [] },
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'SET_CONTACTS':
      return { ...state, contacts: action.payload };
    case 'SET_TESTIMONIALS':
      return { ...state, testimonials: action.payload };
    case 'ADD_TOAST':
      return {
        ...state,
        ui: {
          ...state.ui,
          toasts: [...state.ui.toasts, action.payload],
        },
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        ui: {
          ...state.ui,
          toasts: state.ui.toasts.filter((t) => t.id !== action.payload),
        },
      };
    default:
      return state;
  }
}

export interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextValue | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
