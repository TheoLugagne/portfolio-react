import { Hero, About, Projects, Testimonials, ContactSection } from '../components';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useHashScroll } from '../hooks/useHashScroll';
import { site } from '../data/site';

export default function HomePage() {
  useDocumentTitle(site.tagline);
  useHashScroll();

  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Testimonials />
      <ContactSection />
    </>
  );
}
