import { useCallback } from 'react';
import { useApp } from './useApp';

export function useToast() {
  const { dispatch } = useApp();

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' = 'success') => {
      dispatch({
        type: 'ADD_TOAST',
        payload: { id: crypto.randomUUID(), message, type },
      });
    },
    [dispatch]
  );

  return { showToast };
}
