import { useEffect, useState, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from '../layout/Container';
import { site } from '../../data/site';
import { useAuth } from '../../hooks/useAuth';
import { useActiveSection } from '../../hooks/useActiveSection';
import { scrollToSection, scrollToTop } from '../../hooks/useHashScroll';

const sectionIds = site.navLinks.flatMap((link) =>
  'sectionId' in link && link.sectionId ? [link.sectionId] : []
);

function isExternalHref(href: string): boolean {
  return href.startsWith('http') || href.startsWith('mailto:');
}

function isHashHref(href: string): boolean {
  return href.includes('#');
}

function getHashFromHref(href: string): string {
  const hashIndex = href.indexOf('#');
  return hashIndex === -1 ? '' : href.slice(hashIndex);
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activeSection = useActiveSection(sectionIds);
  const {
    state: { status },
  } = useAuth();

  const toggleMenu = () => setMenuOpen((open) => !open);
  const closeMenu = () => setMenuOpen(false);
  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  const isLinkActive = (href: string, sectionId?: string): boolean => {
    if (sectionId) {
      return pathname === '/' && activeSection === sectionId;
    }

    return pathname === href;
  };

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (isExternalHref(href)) {
      closeMenu();
      return;
    }

    if (!isHashHref(href)) {
      closeMenu();
      return;
    }

    event.preventDefault();
    closeMenu();

    const hash = getHashFromHref(href);
    const basePath = href.slice(0, href.indexOf('#')) || '/';

    if (pathname !== basePath) {
      navigate(`${basePath}${hash}`);
      return;
    }

    window.history.replaceState(null, '', hash || href);
    scrollToSection(hash);
  };

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    closeMenu();

    if (pathname !== '/') {
      navigate('/');
      requestAnimationFrame(() => scrollToTop());
      return;
    }

    window.history.replaceState(null, '', '/');
    scrollToTop();
  };

  const headerClassName = scrolled
    ? 'fixed inset-x-0 top-0 z-20 border-b border-dark/5 bg-white/90 shadow-sm backdrop-blur-md'
    : 'absolute inset-x-0 top-0 z-20 bg-transparent';

  const navButtonClassName = (active: boolean) =>
    [
      'inline-flex w-full items-center justify-center rounded-lg bg-transparent px-5 py-2.5 font-sans text-base font-semibold text-dark transition-colors hover:bg-dark/5 active:bg-dark/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:w-auto',
      active ? 'bg-dark/5' : '',
    ]
      .filter(Boolean)
      .join(' ');

  const adminHref = isAuthenticated ? '/admin/projects' : '/login';
  const adminLabel = isAuthenticated ? 'Admin' : 'Login';

  return (
    <header className={headerClassName}>
      <Container className="relative flex items-center justify-between py-4 md:py-5">
        <Link
          to="/"
          className="font-sans text-lg font-bold text-dark transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          onClick={handleLogoClick}
        >
          {site.name}
        </Link>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-dark transition-colors hover:bg-dark/5 md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
              ? 'absolute left-0 right-0 top-full flex flex-col gap-2 border-t border-dark/10 bg-white px-4 py-4 shadow-card animate-slide-up'
              : 'hidden'
          } md:static md:flex md:flex-row md:items-center md:gap-3 md:border-0 md:bg-transparent md:p-0 md:shadow-none md:animate-none`}
        >
          {site.navLinks.map((link) => {
            const { label, href } = link;
            const sectionId = 'sectionId' in link ? link.sectionId : undefined;
            const active = isLinkActive(href, sectionId);

            if (isExternalHref(href)) {
              return (
                <a
                  key={href}
                  href={href}
                  className={navButtonClassName(active)}
                  onClick={closeMenu}
                >
                  {label}
                </a>
              );
            }

            if (isHashHref(href)) {
              return (
                <a
                  key={href}
                  href={href}
                  className={navButtonClassName(active)}
                  onClick={(event) => handleNavClick(event, href)}
                  aria-current={active ? 'page' : undefined}
                >
                  {label}
                </a>
              );
            }

            return (
              <Link
                key={href}
                to={href}
                className={navButtonClassName(active)}
                onClick={closeMenu}
                aria-current={active ? 'page' : undefined}
              >
                {label}
              </Link>
            );
          })}

          <Link
            to={adminHref}
            className={navButtonClassName(pathname === adminHref)}
            onClick={closeMenu}
          >
            {adminLabel}
          </Link>
        </nav>
      </Container>
    </header>
  );
}
