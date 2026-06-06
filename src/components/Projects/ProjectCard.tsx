import Button from '../ui/Button';

const CARD_MAX_WIDTH = 992;
const CARD_MAX_HEIGHT = 524;

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  url: string;
  reversed?: boolean;
  maxWidth?: number;
  maxHeight?: number;
}

export default function ProjectCard({
  title,
  description,
  image,
  url,
  reversed = false,
  maxWidth = CARD_MAX_WIDTH,
  maxHeight = CARD_MAX_HEIGHT,
}: ProjectCardProps) {
  const imageRoundedClasses = reversed
    ? 'rounded-t-card md:rounded-l-card md:rounded-tr-none'
    : 'rounded-t-card md:rounded-r-card md:rounded-tl-none';

  return (
    <article
      style={{ maxWidth, height: maxHeight }}
      className={`mx-auto flex w-full flex-col overflow-hidden rounded-card bg-white shadow-card md:flex-row ${
        reversed ? 'md:flex-row-reverse' : ''
      }`}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-4 overflow-hidden p-6 md:w-1/2 md:gap-6 md:p-8">
        <h3 className="font-serif text-2xl text-dark md:text-3xl">{title}</h3>
        <p className="line-clamp-4 font-sans text-base leading-relaxed text-muted md:line-clamp-5">
          {description}
        </p>
        <div className="flex-shrink-0">
          <Button variant="outline" href={url}>
            View Project
          </Button>
        </div>
      </div>
      <div className="h-[200px] flex-shrink-0 md:h-full md:w-1/2">
        <img
          src={image}
          alt={`Screenshot of ${title}`}
          loading="lazy"
          className={`h-full w-full object-cover ${imageRoundedClasses}`}
        />
      </div>
    </article>
  );
}
