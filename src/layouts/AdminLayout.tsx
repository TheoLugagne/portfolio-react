import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useContacts } from '../hooks/useContacts';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import PageTransition from '../components/routing/PageTransition';
import ToastContainer from '../components/ui/Toast';
import ConfirmModal from '../components/ui/ConfirmModal';

const navItems: { label: string; to: string; showUnreadBadge?: boolean }[] = [
  { label: 'Projects', to: '/admin/projects' },
  { label: 'Contacts', to: '/admin/contacts', showUnreadBadge: true },
  { label: 'Testimonials', to: '/admin/testimonials' },
  { label: 'Stats', to: '/admin/stats' },
];

const pageTitles: Record<string, string> = {
  '/admin/projects': 'Projects',
  '/admin/contacts': 'Contacts',
  '/admin/testimonials': 'Testimonials',
  '/admin/stats': 'Statistics',
};

export default function AdminLayout() {
  const { pathname } = useLocation();
  const {
    state: { user },
    logout,
  } = useAuth();
  const { unreadCount } = useContacts();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const pageTitle = pageTitles[pathname] ?? 'Dashboard';
  useDocumentTitle(`Admin — ${pageTitle}`);

  const handleLogout = () => {
    setLogoutConfirmOpen(false);
    logout();
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="flex w-56 flex-shrink-0 flex-col border-r border-dark/10 bg-white">
        <div className="border-b border-dark/10 px-6 py-6">
          <p className="font-sans text-sm font-semibold text-muted">Admin</p>
          <p className="font-serif text-lg text-dark">
            {user?.name ?? 'Dashboard'}
          </p>
        </div>
        <nav aria-label="Admin navigation" className="flex flex-1 flex-col gap-1 p-4">
          {navItems.map(({ label, to, showUnreadBadge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-lg px-4 py-2 font-sans text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary/20 text-dark'
                    : 'text-muted hover:bg-dark/5 hover:text-dark'
                }`
              }
            >
              {label}
              {showUnreadBadge && unreadCount > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 font-sans text-xs font-bold text-dark">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-dark/10 p-4">
          <button
            type="button"
            onClick={() => setLogoutConfirmOpen(true)}
            className="w-full rounded-lg px-4 py-2 text-left font-sans text-sm font-semibold text-muted transition-colors hover:bg-dark/5 hover:text-dark"
          >
            Logout
          </button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-dark/10 bg-white px-8 py-4">
          <h1 className="font-serif text-2xl text-dark">{pageTitle}</h1>
          {user && (
            <div className="flex items-center gap-3">
              {user.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-9 w-9 rounded-full object-cover"
                />
              )}
              <div className="text-right">
                <p className="font-sans text-sm font-semibold text-dark">
                  {user.name}
                </p>
                <p className="font-sans text-xs text-muted">{user.email}</p>
              </div>
            </div>
          )}
        </header>
        <main className="flex-1 p-8">
          <PageTransition />
        </main>
      </div>
      <ToastContainer />
      <ConfirmModal
        open={logoutConfirmOpen}
        title="Log out"
        message="Are you sure you want to log out of the admin dashboard?"
        confirmLabel="Log out"
        onConfirm={handleLogout}
        onCancel={() => setLogoutConfirmOpen(false)}
      />
    </div>
  );
}
