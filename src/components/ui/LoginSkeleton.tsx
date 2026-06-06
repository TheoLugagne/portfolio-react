import Skeleton from './Skeleton';

export default function LoginSkeleton() {
  return (
    <div
      role="status"
      aria-label="Signing in"
      className="mt-6 space-y-3"
    >
      <Skeleton className="mx-auto h-10 w-48" />
      <Skeleton className="mx-auto h-3 w-32" />
      <span className="sr-only">Signing in…</span>
    </div>
  );
}
