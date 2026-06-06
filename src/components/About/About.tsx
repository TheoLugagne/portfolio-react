import Container from '../layout/Container';
import SectionHeading from '../layout/SectionHeading';
import { site } from '../../data/site';

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-24 bg-surface py-16 md:py-24"
    >
      <Container>
        <SectionHeading id="about-heading" className="mb-6">
          {site.about.title}
        </SectionHeading>
        <p className="mx-auto max-w-2xl text-center font-sans text-base leading-relaxed text-muted">
          {site.about.description}
        </p>
      </Container>
    </section>
  );
}
