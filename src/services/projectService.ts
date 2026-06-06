import type { Project } from '../types';
import type { ProjectFormData } from '../schemas/projectSchema';
import { apiClient } from './apiClient';

export async function getProjects(): Promise<Project[]> {
  return apiClient<Project[]>('/api/projects');
}

export async function getProject(id: string): Promise<Project> {
  return apiClient<Project>(`/api/projects/${id}`);
}

export async function getAdminProjects(token: string): Promise<Project[]> {
  return apiClient<Project[]>('/api/projects/admin/all', { token });
}

export async function getAdminProject(
  id: string,
  token: string
): Promise<Project> {
  return apiClient<Project>(`/api/projects/admin/${id}`, { token });
}

export async function createProject(
  data: ProjectFormData,
  token: string
): Promise<Project> {
  return apiClient<Project>('/api/projects', {
    method: 'POST',
    body: data,
    token,
  });
}

export async function updateProject(
  id: string,
  data: Partial<ProjectFormData>,
  token: string
): Promise<Project> {
  return apiClient<Project>(`/api/projects/${id}`, {
    method: 'PUT',
    body: data,
    token,
  });
}

export async function deleteProject(id: string, token: string): Promise<void> {
  return apiClient<void>(`/api/projects/${id}`, {
    method: 'DELETE',
    token,
  });
}
