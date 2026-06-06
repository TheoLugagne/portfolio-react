import { useEffect } from 'react';
import { site } from '../data/site';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} — ${site.name}` : site.title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
