import Container from '../components/layout/Container';
import SectionHeading from '../components/layout/SectionHeading';
import ContactForm from '../components/Contact/ContactForm';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function ContactPage() {
  useDocumentTitle('Contact');

  return (
    <section className="scroll-mt-24 bg-surface py-16 md:py-24">
      <Container>
        <SectionHeading className="mb-4">Contact</SectionHeading>
        <p className="mx-auto mb-10 max-w-lg text-center font-sans text-base text-muted">
          Fill out the form below and I&apos;ll get back to you as soon as possible.
        </p>
        <ContactForm />
      </Container>
    </section>
  );
}
