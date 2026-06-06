import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function useActiveSection(sectionIds: readonly string[]): string | null {
  const { pathname } = useLocation();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection(null);
      return;
    }

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              elements.indexOf(a.target as HTMLElement) -
              elements.indexOf(b.target as HTMLElement)
          );

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [pathname, sectionIds]);

  return activeSection;
}
