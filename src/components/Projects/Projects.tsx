import Container from '../layout/Container';
import SectionHeading from '../layout/SectionHeading';
import ProjectCard from './ProjectCard';
import ProjectCardSkeleton from './ProjectCardSkeleton';
import { useProjects } from '../../hooks/useProjects';

export default function Projects() {
  const { projects, loading, error } = useProjects();

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="scroll-mt-24 bg-surface py-16 md:py-24"
    >
      <Container>
        <SectionHeading id="projects-heading" className="mb-12 md:mb-16">
          Projects
        </SectionHeading>

        {loading && (
          <ul className="mx-auto flex w-full max-w-[992px] flex-col gap-12">
            {[false, true, false].map((reversed, index) => (
              <li key={index} className="w-full">
                <ProjectCardSkeleton reversed={reversed} />
              </li>
            ))}
          </ul>
        )}

        {!loading && error && (
          <p className="text-center font-sans text-base text-muted" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && projects.length === 0 && (
          <p className="text-center font-sans text-base text-muted">
            No projects published yet.
          </p>
        )}

        {!loading && !error && projects.length > 0 && (
          <ul className="mx-auto flex w-full max-w-[992px] flex-col gap-12">
            {projects.map((project, index) => (
              <li key={project.id} className="w-full">
                <ProjectCard project={project} reversed={index % 2 === 1} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
