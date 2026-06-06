import { Link } from 'react-router-dom';
import Container from '../layout/Container';
import SectionHeading from '../layout/SectionHeading';

const primaryButtonClasses =
  'inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 font-sans text-base font-semibold text-dark transition-colors hover:brightness-95 active:brightness-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

export default function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-surface py-16 md:py-24"
    >
      <Container>
        <SectionHeading id="contact-heading" className="mb-6">
          Get in touch
        </SectionHeading>
        <p className="mx-auto mb-8 max-w-lg text-center font-sans text-base text-muted">
          Have a project in mind or want to connect? I&apos;d love to hear from you.
        </p>
        <div className="flex justify-center">
          <Link to="/contact" className={primaryButtonClasses}>
            Contact me
          </Link>
        </div>
      </Container>
    </section>
  );
}
