import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function scrollToSection(hash: string): void {
  const id = hash.replace(/^#/, '');
  if (!id) return;

  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function useHashScroll(): void {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname !== '/' || !hash) return;

    requestAnimationFrame(() => {
      scrollToSection(hash);
    });
  }, [pathname, hash]);
}
