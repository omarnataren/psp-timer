import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getDefectLogs,
  createDefectLog,
  updateDefectLog,
  deleteDefectLog,
} from '../api/defectLogsApi';

const POLL_INTERVAL = 5_000;

export function useDefectLogs(projectName) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pendingIds = useRef(new Set());

  const fetchSilent = useCallback(() => {
    if (!projectName) return;
    getDefectLogs(projectName)
      .then((data) => {
        setLogs((prev) =>
          data.map((row) =>
            pendingIds.current.has(row.id)
              ? (prev.find((r) => r.id === row.id) ?? row)
              : row
          )
        );
      })
      .catch(() => {});
  }, [projectName]);

  useEffect(() => {
    if (!projectName) return;
    setLoading(true);
    getDefectLogs(projectName)
      .then((data) => { setLogs(data); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    const timer = setInterval(fetchSilent, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [projectName, fetchSilent]);

  const addLog = useCallback(async (rowData) => {
    const saved = await createDefectLog(rowData, projectName);
    setLogs((prev) => [...prev, saved]);
    return saved;
  }, [projectName]);

  const updateLog = useCallback(async (id, updatedRow) => {
    pendingIds.current.add(id);
    setLogs((prev) => prev.map((r) => (r.id === id ? updatedRow : r)));
    try {
      await updateDefectLog(id, updatedRow, projectName);
    } finally {
      pendingIds.current.delete(id);
    }
  }, [projectName]);

  const deleteLog = useCallback(async (id) => {
    setLogs((prev) => prev.filter((r) => r.id !== id));
    await deleteDefectLog(id);
  }, []);

  return { logs, loading, error, addLog, updateLog, deleteLog };
}
