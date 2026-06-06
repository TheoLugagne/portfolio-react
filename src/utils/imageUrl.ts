const PLACEHOLDER = '/assets/images/project-1.jpg';

export function resolveImageUrl(path: string | null | undefined): string {
  if (!path) return PLACEHOLDER;
  if (path.startsWith('http') || path.startsWith('/')) return path;
  return `/${path}`;
}
