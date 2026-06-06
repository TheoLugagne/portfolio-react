import Container from '../layout/Container';
import Skeleton from '../ui/Skeleton';

export default function ProjectDetailSkeleton() {
  return (
    <Container className="py-24" aria-hidden="true">
      <article className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-64 w-full rounded-card" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
      </article>
    </Container>
  );
}
