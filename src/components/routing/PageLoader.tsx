import Container from '../layout/Container';
import Skeleton from '../ui/Skeleton';

export default function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="min-h-screen animate-fade-in bg-white py-24"
    >
      <Container>
        <div className="mx-auto max-w-2xl space-y-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </Container>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
