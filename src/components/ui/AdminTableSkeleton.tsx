import Skeleton from './Skeleton';

interface AdminTableSkeletonProps {
  columns?: number;
  rows?: number;
}

export default function AdminTableSkeleton({
  columns = 4,
  rows = 5,
}: AdminTableSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-card bg-white shadow-card"
    >
      <div className="flex gap-4 border-b border-dark/10 bg-surface px-6 py-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={`head-${i}`}
            className={`h-3 ${i === 0 ? 'w-24' : 'hidden w-16 sm:block'}`}
          />
        ))}
      </div>
      <div className="divide-y divide-dark/5">
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="flex items-center gap-4 px-6 py-4">
            <Skeleton className="h-4 w-32 flex-1" />
            <Skeleton className="hidden h-4 w-20 sm:block" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="hidden h-4 w-20 md:block" />
            <div className="flex gap-2">
              <Skeleton className="h-7 w-14 rounded-lg" />
              <Skeleton className="h-7 w-14 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
