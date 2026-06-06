import Container from '../components/layout/Container';
import PageTransition from '../components/routing/PageTransition';
import ToastContainer from '../components/ui/Toast';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <Container className="max-w-md">
        <PageTransition />
      </Container>
      <ToastContainer />
    </div>
  );
}
