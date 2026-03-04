import { useState, useEffect, useCallback } from 'react';
import {
  getDefectLogs,
  createDefectLog,
  updateDefectLog,
  deleteDefectLog,
} from '../api/defectLogsApi';

export function useDefectLogs(projectName) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectName) return;
    setLoading(true);
    getDefectLogs(projectName)
      .then((data) => { setLogs(data); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [projectName]);

  const addLog = useCallback(async (rowData) => {
    const saved = await createDefectLog(rowData, projectName);
    setLogs((prev) => [...prev, saved]);
    return saved;
  }, [projectName]);

  const updateLog = useCallback(async (id, updatedRow) => {
    setLogs((prev) => prev.map((r) => (r.id === id ? updatedRow : r)));
    await updateDefectLog(id, updatedRow, projectName);
  }, [projectName]);

  const deleteLog = useCallback(async (id) => {
    setLogs((prev) => prev.filter((r) => r.id !== id));
    await deleteDefectLog(id);
  }, []);

  return { logs, loading, error, addLog, updateLog, deleteLog };
}
