import { Link } from 'react-router-dom';
import type { Project } from '../../types';
import { resolveImageUrl } from '../../utils/imageUrl';

const CARD_MAX_WIDTH = 992;
const CARD_MAX_HEIGHT = 524;

const outlineButtonClasses =
  'inline-flex items-center justify-center rounded-lg border-2 border-dark bg-transparent px-8 py-3 font-sans text-base font-semibold text-dark transition-colors hover:bg-dark/5 active:bg-dark/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

interface ProjectCardProps {
  project: Project;
  reversed?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  preview?: boolean;
}

export default function ProjectCard({
  project,
  reversed = false,
  maxWidth = CARD_MAX_WIDTH,
  maxHeight = CARD_MAX_HEIGHT,
  preview = false,
}: ProjectCardProps) {
  const imageRoundedClasses = reversed
    ? 'rounded-t-card md:rounded-l-card md:rounded-tr-none'
    : 'rounded-t-card md:rounded-r-card md:rounded-tl-none';

  const imageUrl = resolveImageUrl(project.imagePath);

  return (
    <article
      style={{ maxWidth, height: maxHeight }}
      className={`mx-auto flex w-full flex-col overflow-hidden rounded-card bg-white shadow-card md:flex-row ${
        reversed ? 'md:flex-row-reverse' : ''
      }`}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-4 overflow-hidden p-6 md:w-1/2 md:gap-6 md:p-8">
        <h3 className="font-serif text-2xl text-dark md:text-3xl">
          {project.title}
        </h3>
        <p className="line-clamp-4 font-sans text-base leading-relaxed text-muted md:line-clamp-5">
          {project.description}
        </p>
        <div className="flex-shrink-0">
          {preview ? (
            <span className={`${outlineButtonClasses} cursor-default opacity-70`}>
              View Project
            </span>
          ) : (
            <Link
              to={`/projects/${project.id}`}
              className={outlineButtonClasses}
            >
              View Project
            </Link>
          )}
        </div>
      </div>
      <div className="h-[200px] flex-shrink-0 md:h-full md:w-1/2">
        <img
          src={imageUrl}
          alt={`Screenshot of ${project.title}`}
          loading="lazy"
          className={`h-full w-full object-cover ${imageRoundedClasses}`}
        />
      </div>
    </article>
  );
}
