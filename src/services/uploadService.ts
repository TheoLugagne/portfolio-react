import type { ApiError } from '../types';
import { ApiClientError } from './apiClient';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export type UploadSubdir = 'projects' | 'testimonials' | 'avatars';

interface UploadResponse {
  path: string;
}

export async function uploadImage(
  file: File,
  token: string,
  subdir: UploadSubdir = 'projects'
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('subdir', subdir);

  const response = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({
      message: response.statusText,
    }))) as ApiError;
    throw new ApiClientError(response.status, errorBody);
  }

  const data = (await response.json()) as UploadResponse;
  return data.path;
}
