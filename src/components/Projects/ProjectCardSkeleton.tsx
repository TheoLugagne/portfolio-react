import Skeleton from '../ui/Skeleton';

const CARD_MAX_WIDTH = 992;
const CARD_MAX_HEIGHT = 524;

interface ProjectCardSkeletonProps {
  reversed?: boolean;
}

export default function ProjectCardSkeleton({
  reversed = false,
}: ProjectCardSkeletonProps) {
  return (
    <div
      style={{ maxWidth: CARD_MAX_WIDTH, height: CARD_MAX_HEIGHT }}
      className={`mx-auto flex w-full flex-col overflow-hidden rounded-card bg-white shadow-card md:flex-row ${
        reversed ? 'md:flex-row-reverse' : ''
      }`}
      aria-hidden="true"
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-4 p-6 md:w-1/2 md:gap-6 md:p-8">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="mt-2 h-12 w-36" />
      </div>
      <div className="h-[200px] flex-shrink-0 md:h-full md:w-1/2">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
    </div>
  );
}
