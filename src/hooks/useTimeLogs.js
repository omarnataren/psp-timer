import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getTimeLogs,
  createTimeLog,
  updateTimeLog,
  deleteTimeLog,
} from '../api/timeLogsApi';

const POLL_INTERVAL = 20_000;

export function useTimeLogs(projectName) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pendingIds = useRef(new Set()); // ids con save pendiente — no sobreescribir

  const fetchSilent = useCallback(() => {
    if (!projectName) return;
    getTimeLogs(projectName)
      .then((data) => {
        setLogs((prev) => {
          // Preserva drafts locales de filas con save pendiente
          return data.map((row) =>
            pendingIds.current.has(row.id)
              ? (prev.find((r) => r.id === row.id) ?? row)
              : row
          );
        });
      })
      .catch(() => {}); // silencioso en background
  }, [projectName]);

  useEffect(() => {
    if (!projectName) return;
    setLoading(true);
    getTimeLogs(projectName)
      .then((data) => { setLogs(data); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    const timer = setInterval(fetchSilent, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [projectName, fetchSilent]);

  const addLog = useCallback(async (rowData) => {
    const saved = await createTimeLog(rowData, projectName);
    setLogs((prev) => [...prev, saved]);
    return saved;
  }, [projectName]);

  const updateLog = useCallback(async (id, updatedRow) => {
    pendingIds.current.add(id);
    setLogs((prev) => prev.map((r) => (r.id === id ? updatedRow : r)));
    try {
      await updateTimeLog(id, updatedRow, projectName);
    } finally {
      pendingIds.current.delete(id);
    }
  }, [projectName]);

  const deleteLog = useCallback(async (id) => {
    setLogs((prev) => prev.filter((r) => r.id !== id));
    await deleteTimeLog(id);
  }, []);

  return { logs, loading, error, addLog, updateLog, deleteLog };
}
