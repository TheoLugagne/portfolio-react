import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PageLoader from './PageLoader';

export default function ProtectedRoute() {
  const {
    state: { status },
  } = useAuth();

  if (status === 'loading') {
    return <PageLoader />;
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
