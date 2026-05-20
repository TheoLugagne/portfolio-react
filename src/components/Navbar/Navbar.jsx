import { useState } from 'react';
import Container from '../layout/Container';
import { site } from '../../data/site';
import Header from '../layout/Header';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((open) => !open);
  const closeMenu = () => setMenuOpen(false);

  return (
    <Header>
      <Container className="flex items-center justify-between py-6">
        <a
          href="#hero"
          className="font-sans text-lg font-bold text-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          onClick={closeMenu}
        >
          {site.name}
        </a>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-dark md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={toggleMenu}
        >
          <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
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
          {site.navLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="font-sans text-base font-semibold text-dark transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={closeMenu}
            >
              {label}
            </a>
          ))}
        </nav>
      </Container>
    </Header>
  );
}
