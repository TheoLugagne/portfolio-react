import { useEffect, useState } from 'react';
import type { Project } from '../types';
import { ApiClientError } from '../services/apiClient';
import { getProject } from '../services/projectService';

interface UseProjectResult {
  project: Project | null;
  loading: boolean;
  notFound: boolean;
  error: string | null;
}

export function useProject(id: string | undefined): UseProjectResult {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    const projectId = id;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const data = await getProject(projectId);
        if (!cancelled) setProject(data);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiClientError && err.status === 404) {
          setNotFound(true);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load project');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { project, loading, notFound, error };
}
