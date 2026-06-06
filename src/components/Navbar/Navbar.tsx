import { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../layout/Container';
import { site } from '../../data/site';
import { useAuth } from '../../hooks/useAuth';

function isExternalHref(href: string): boolean {
  return href.startsWith('http') || href.startsWith('mailto:');
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    state: { status },
  } = useAuth();

  const toggleMenu = () => setMenuOpen((open) => !open);
  const closeMenu = () => setMenuOpen(false);
  const isAuthenticated = status === 'authenticated';

  const linkClassName =
    'font-sans text-base font-semibold text-dark transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

  return (
    <header className="absolute inset-x-0 top-0 z-20 bg-transparent">
      <Container className="relative flex items-center justify-between bg-transparent py-6">
        <Link
          to="/"
          className="font-sans text-lg font-bold text-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          onClick={closeMenu}
        >
          {site.name}
        </Link>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-dark md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={toggleMenu}
        >
          <span className="sr-only">
            {menuOpen ? 'Close menu' : 'Open menu'}
          </span>
          {menuOpen ? (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>

        <nav
          id="main-navigation"
          aria-label="Main"
          className={`${
            menuOpen
              ? 'absolute left-0 right-0 top-full flex flex-col gap-4 border-t border-dark/10 bg-white px-4 py-6 shadow-card'
              : 'hidden'
          } md:static md:flex md:flex-row md:items-center md:gap-10 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          {site.navLinks.map(({ label, href }) =>
            isExternalHref(href) ? (
              <a
                key={href}
                href={href}
                className={linkClassName}
                onClick={closeMenu}
              >
                {label}
              </a>
            ) : (
              <Link
                key={href}
                to={href}
                className={linkClassName}
                onClick={closeMenu}
              >
                {label}
              </Link>
            )
          )}
          <Link
            to={isAuthenticated ? '/admin/projects' : '/login'}
            className={linkClassName}
            onClick={closeMenu}
          >
            {isAuthenticated ? 'Admin' : 'Login'}
          </Link>
        </nav>
      </Container>
    </header>
  );
}
