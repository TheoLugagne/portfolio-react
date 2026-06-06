import { Link, useParams } from 'react-router-dom';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import ProjectDetailSkeleton from '../components/Projects/ProjectDetailSkeleton';
import { useProject } from '../hooks/useProject';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { resolveImageUrl } from '../utils/imageUrl';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { project, loading, notFound, error } = useProject(id);

  useDocumentTitle(
    loading ? undefined : notFound ? 'Project not found' : project?.title
  );

  if (loading) {
    return <ProjectDetailSkeleton />;
  }

  if (notFound) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-serif text-3xl text-dark">Project not found</h1>
        <p className="mt-4 font-sans text-muted">
          The project you are looking for does not exist.
        </p>
        <div className="mt-8">
          <Button variant="primary" href="/">
            Back to home
          </Button>
        </div>
      </Container>
    );
  }

  if (error || !project) {
    return (
      <Container className="py-24 text-center">
        <p className="font-sans text-muted" role="alert">
          {error ?? 'Something went wrong'}
        </p>
      </Container>
    );
  }

  const imageUrl = resolveImageUrl(project.imagePath);
  const bodyContent = project.content || project.description;

  return (
    <Container className="py-24">
      <article className="mx-auto max-w-3xl">
        <Link
          to="/#projects"
          className="mb-8 inline-block font-sans text-sm font-semibold text-muted transition-colors hover:text-dark"
        >
          ← Back to projects
        </Link>

        <h1 className="font-serif text-4xl text-dark">{project.title}</h1>

        {project.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-primary/20 px-3 py-1 font-sans text-sm font-semibold text-dark"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        <img
          src={imageUrl}
          alt={project.title}
          className="mt-8 w-full rounded-card object-cover shadow-card"
        />

        <div className="mt-8 space-y-4 font-sans text-base leading-relaxed text-muted">
          {bodyContent.split('\n').map((paragraph, index) =>
            paragraph.trim() ? (
              <p key={index}>{paragraph}</p>
            ) : null
          )}
        </div>

        {(project.demoUrl || project.githubUrl) && (
          <div className="mt-8 flex flex-wrap gap-4">
            {project.demoUrl && (
              <Button variant="primary" href={project.demoUrl}>
                View demo
              </Button>
            )}
            {project.githubUrl && (
              <Button variant="outline" href={project.githubUrl}>
                View on GitHub
              </Button>
            )}
          </div>
        )}
      </article>
    </Container>
  );
}
