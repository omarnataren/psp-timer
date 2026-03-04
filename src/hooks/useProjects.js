import { useState, useEffect, useCallback } from 'react';
import { getAllProjects, createProject as apiCreate } from '../api/projectsApi';

export function useProjects(user) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getAllProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetch(); }, [fetch]);

  const createProject = useCallback(async (name, teamId) => {
    const p = await apiCreate(name, teamId);
    await fetch();
    return p;
  }, [fetch]);

  return { projects, loading, error, createProject, refetch: fetch };
}
