import { useEffect, useRef } from 'react';
import Button from './Button';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    cancelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <div
        className="absolute inset-0 animate-fade-in bg-dark/40"
        aria-hidden="true"
        onClick={onCancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        className="relative w-full max-w-md animate-scale-in rounded-card bg-white p-6 shadow-card"
      >
        <h2
          id="confirm-modal-title"
          className="font-serif text-xl text-dark"
        >
          {title}
        </h2>
        <p
          id="confirm-modal-message"
          className="mt-3 font-sans text-base text-muted"
        >
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-lg px-4 py-2 font-sans text-sm font-semibold text-muted transition-colors hover:bg-dark/5 hover:text-dark disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <Button
            type="button"
            variant={variant === 'danger' ? 'outline' : 'primary'}
            disabled={loading}
            onClick={onConfirm}
            className={`px-4 py-2 text-sm ${
              variant === 'danger'
                ? 'border-red-600 text-red-600 hover:bg-red-50'
                : ''
            }`}
          >
            {loading ? 'Please wait…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
