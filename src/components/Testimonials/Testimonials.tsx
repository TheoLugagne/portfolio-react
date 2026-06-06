import Container from '../layout/Container';
import SectionHeading from '../layout/SectionHeading';
import Skeleton from '../ui/Skeleton';
import { useTestimonials } from '../../hooks/useTestimonials';
import { resolveImageUrl } from '../../utils/imageUrl';

function TestimonialSkeleton() {
  return (
    <div
      className="flex flex-col rounded-card bg-white p-6 shadow-card md:p-8"
      aria-hidden="true"
    >
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
      <div className="mt-6 flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({
  author,
  role,
  content,
  avatarPath,
}: {
  author: string;
  role: string;
  content: string;
  avatarPath: string | null;
}) {
  const avatarUrl = avatarPath ? resolveImageUrl(avatarPath) : null;

  return (
    <blockquote className="flex h-full flex-col rounded-card bg-white p-6 shadow-card md:p-8">
      <p className="flex-1 font-sans text-base leading-relaxed text-muted">
        &ldquo;{content}&rdquo;
      </p>
      <footer className="mt-6 flex items-center gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 font-sans text-lg font-bold text-dark"
          >
            {author.charAt(0).toUpperCase()}
          </div>
        )}
        <cite className="not-italic">
          <p className="font-sans text-base font-semibold text-dark">{author}</p>
          <p className="font-sans text-sm text-muted">{role}</p>
        </cite>
      </footer>
    </blockquote>
  );
}

export default function Testimonials() {
  const { testimonials, loading, error } = useTestimonials();

  if (!loading && !error && testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="bg-white py-16 md:py-24"
    >
      <Container>
        <SectionHeading id="testimonials-heading" className="mb-12 md:mb-16">
          Testimonials
        </SectionHeading>

        {loading && (
          <div className="mx-auto grid max-w-[992px] gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <TestimonialSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="text-center font-sans text-base text-muted" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && testimonials.length > 0 && (
          <div className="mx-auto grid max-w-[992px] gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                author={testimonial.author}
                role={testimonial.role}
                content={testimonial.content}
                avatarPath={testimonial.avatarPath}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
