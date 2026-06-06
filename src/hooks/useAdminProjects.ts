import { useCallback, useEffect, useState } from 'react';
import type { Project } from '../types';
import {
  createProject,
  deleteProject,
  getAdminProjects,
  updateProject,
} from '../services/projectService';
import type { ProjectFormData } from '../schemas/projectSchema';
import { useAuth } from './useAuth';

interface UseAdminProjectsResult {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  create: (data: ProjectFormData) => Promise<Project>;
  update: (id: string, data: Partial<ProjectFormData>) => Promise<Project>;
  remove: (id: string) => Promise<void>;
}

export function useAdminProjects(): UseAdminProjectsResult {
  const {
    state: { token },
  } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminProjects(token);
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = useCallback(
    async (data: ProjectFormData) => {
      if (!token) throw new Error('Not authenticated');
      const project = await createProject(data, token);
      setProjects((prev) => [project, ...prev]);
      return project;
    },
    [token]
  );

  const update = useCallback(
    async (id: string, data: Partial<ProjectFormData>) => {
      if (!token) throw new Error('Not authenticated');
      const project = await updateProject(id, data, token);
      setProjects((prev) =>
        prev.map((item) => (item.id === id ? project : item))
      );
      return project;
    },
    [token]
  );

  const remove = useCallback(
    async (id: string) => {
      if (!token) throw new Error('Not authenticated');
      await deleteProject(id, token);
      setProjects((prev) => prev.filter((item) => item.id !== id));
    },
    [token]
  );

  return { projects, loading, error, refetch, create, update, remove };
}
