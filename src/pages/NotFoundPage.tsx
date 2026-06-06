import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');

  return (
    <Container className="flex flex-col items-center justify-center py-24 text-center">
      <p className="font-sans text-base font-semibold text-primary">404</p>
      <h1 className="mt-2 font-serif text-4xl text-dark">Page not found</h1>
      <p className="mt-4 max-w-md font-sans text-base text-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8">
        <Button variant="primary" href="/">
          Back to home
        </Button>
      </div>
      <Link
        to="/"
        className="mt-4 font-sans text-sm text-muted underline hover:text-dark"
      >
        Go to homepage
      </Link>
    </Container>
  );
}
