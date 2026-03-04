import { useState, useEffect, useCallback } from 'react';
import {
  getTimeLogs,
  createTimeLog,
  updateTimeLog,
  deleteTimeLog,
} from '../api/timeLogsApi';

export function useTimeLogs(projectName) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectName) return;
    setLoading(true);
    getTimeLogs(projectName)
      .then((data) => { setLogs(data); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [projectName]);

  const addLog = useCallback(async (rowData) => {
    const saved = await createTimeLog(rowData, projectName);
    setLogs((prev) => [...prev, saved]);
    return saved;
  }, [projectName]);

  const updateLog = useCallback(async (id, updatedRow) => {
    setLogs((prev) => prev.map((r) => (r.id === id ? updatedRow : r)));
    await updateTimeLog(id, updatedRow, projectName);
  }, [projectName]);

  const deleteLog = useCallback(async (id) => {
    setLogs((prev) => prev.filter((r) => r.id !== id));
    await deleteTimeLog(id);
  }, []);

  return { logs, loading, error, addLog, updateLog, deleteLog };
}
