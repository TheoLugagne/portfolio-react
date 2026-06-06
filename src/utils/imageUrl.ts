const PLACEHOLDER = '/assets/images/project-1.jpg';
const API_BASE = import.meta.env.VITE_API_URL ?? '';

export function resolveImageUrl(path: string | null | undefined): string {
  if (!path) return PLACEHOLDER;
  if (path.startsWith('http')) return path;

  const normalized = path.startsWith('/') ? path : `/${path}`;

  // Uploaded files are served by the API (/uploads → server, not static www/)
  if (normalized.startsWith('/uploads/')) {
    return `${API_BASE}${normalized}`;
  }

  return normalized;
}
