import { Hero, Projects, Testimonials, ContactSection } from '../components';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { site } from '../data/site';

export default function HomePage() {
  useDocumentTitle(site.tagline);

  return (
    <>
      <Hero />
      <Projects />
      <Testimonials />
      <ContactSection />
    </>
  );
}
