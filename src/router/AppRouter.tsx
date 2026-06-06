import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PageLoader from '../components/routing/PageLoader';
import ProtectedRoute from '../components/routing/ProtectedRoute';

const PublicLayout = lazy(() => import('../layouts/PublicLayout'));
const AuthLayout = lazy(() => import('../layouts/AuthLayout'));
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));

const HomePage = lazy(() => import('../pages/HomePage'));
const ProjectDetailPage = lazy(() => import('../pages/ProjectDetailPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const AdminProjectsPage = lazy(
  () => import('../pages/admin/AdminProjectsPage')
);
const AdminContactsPage = lazy(
  () => import('../pages/admin/AdminContactsPage')
);
const AdminTestimonialsPage = lazy(
  () => import('../pages/admin/AdminTestimonialsPage')
);
const AdminStatsPage = lazy(() => import('../pages/admin/AdminStatsPage'));

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

const router = createBrowserRouter([
  {
    element: withSuspense(<PublicLayout />),
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      {
        path: 'projects/:id',
        element: withSuspense(<ProjectDetailPage />),
      },
      { path: 'contact', element: withSuspense(<ContactPage />) },
      { path: '*', element: withSuspense(<NotFoundPage />) },
    ],
  },
  {
    element: withSuspense(<AuthLayout />),
    children: [{ path: 'login', element: withSuspense(<LoginPage />) }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: withSuspense(<AdminLayout />),
        children: [
          {
            path: 'admin/projects',
            element: withSuspense(<AdminProjectsPage />),
          },
          {
            path: 'admin/contacts',
            element: withSuspense(<AdminContactsPage />),
          },
          {
            path: 'admin/testimonials',
            element: withSuspense(<AdminTestimonialsPage />),
          },
          {
            path: 'admin/stats',
            element: withSuspense(<AdminStatsPage />),
          },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
