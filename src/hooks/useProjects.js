import { useState, useEffect, useCallback } from 'react';
import { getProjects, createProject as apiCreate } from '../api/projectsApi';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getProjects()
      .then((data) => {
        setProjects(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const createProject = useCallback(async (name) => {
    const savedName = await apiCreate(name);
    setProjects((prev) => [...prev, savedName]);
    return savedName;
  }, []);

  return { projects, loading, error, createProject };
}
