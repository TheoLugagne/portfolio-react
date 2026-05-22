import Container from '../layout/Container';
import SectionHeading from '../layout/SectionHeading';
import ProjectCard from './ProjectCard';
import { projects } from '../../data/projects';

export default function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="bg-surface py-16 md:py-24"
    >
      <Container>
        <SectionHeading id="projects-heading" className="mb-12 md:mb-16">
          Projects
        </SectionHeading>
        <ul className="mx-auto flex w-full max-w-[992px] flex-col gap-12">
          {projects.map((project) => (
            <li key={project.id} className="w-full">
              <ProjectCard {...project} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
