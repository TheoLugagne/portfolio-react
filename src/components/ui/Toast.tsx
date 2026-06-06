import { useCallback, useEffect, useState } from 'react';
import { useApp } from '../../hooks/useApp';

const DISMISS_DURATION_MS = 200;

export default function ToastContainer() {
  const {
    state: {
      ui: { toasts },
    },
    dispatch,
  } = useApp();
  const [dismissing, setDismissing] = useState<Set<string>>(new Set());

  const dismissToast = useCallback(
    (id: string) => {
      setDismissing((prev) => new Set(prev).add(id));
      setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', payload: id });
        setDismissing((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, DISMISS_DURATION_MS);
    },
    [dispatch]
  );

  useEffect(() => {
    if (toasts.length === 0) return;

    const timers = toasts
      .filter((toast) => !dismissing.has(toast.id))
      .map((toast) =>
        setTimeout(() => dismissToast(toast.id), 5000)
      );

    return () => timers.forEach(clearTimeout);
  }, [toasts, dismissing, dismissToast]);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={`flex min-w-[280px] max-w-sm items-start gap-3 rounded-lg px-4 py-3 shadow-card ${
            dismissing.has(toast.id)
              ? 'animate-slide-out-right'
              : 'animate-slide-in-right'
          } ${
            toast.type === 'success'
              ? 'bg-white text-dark'
              : 'bg-dark text-white'
          }`}
        >
          <p className="flex-1 font-sans text-sm">{toast.message}</p>
          <button
            type="button"
            aria-label="Dismiss"
            className="font-sans text-sm opacity-70 hover:opacity-100"
            onClick={() => dismissToast(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
