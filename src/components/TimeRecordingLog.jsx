import { useState } from 'react';
import { PHASES, INITIAL_TIME_ROW, calculateDelta } from '../constants';
import { ConfirmDialog } from './ConfirmDialog';

export function TimeRecordingLog({ logs, loading, error, addLog, updateLog, deleteLog, headerDate, profiles = {} }) {
  // drafts: { [id]: rowData } — unsaved local edits
  const [drafts, setDrafts] = useState({});
  const [saving, setSaving] = useState({});
  const [confirmId, setConfirmId] = useState(null);

  const getRow = (id) => drafts[id] ?? logs.find((r) => r.id === id);

  const handleChange = (id, field, value) => {
    const base = getRow(id);
    if (!base) return;
    const updated = { ...base, [field]: value };
    if (['start', 'stop', 'interruption'].includes(field)) {
      updated.delta = calculateDelta(updated.start, updated.stop, updated.interruption);
    }
    setDrafts((prev) => ({ ...prev, [id]: updated }));
  };

  const handleSave = async (id) => {
    const draft = drafts[id];
    if (!draft) return;
    setSaving((prev) => ({ ...prev, [id]: true }));
    try {
      await updateLog(id, draft);
      setDrafts((prev) => { const n = { ...prev }; delete n[id]; return n; });
    } finally {
      setSaving((prev) => { const n = { ...prev }; delete n[id]; return n; });
    }
  };

  const handleAdd = () => {
    const newRow = { ...INITIAL_TIME_ROW, date: headerDate };
    addLog(newRow);
  };

  const stats = PHASES.reduce((acc, phase) => {
    acc[phase] = { delta: 0, interruption: 0 };
    return acc;
  }, {});
  logs.forEach((row) => {
    if (stats[row.phase]) {
      stats[row.phase].delta += Number(row.delta) || 0;
      stats[row.phase].interruption += Number(row.interruption) || 0;
    }
  });
  const totalDelta = Object.values(stats).reduce((a, c) => a + c.delta, 0);
  const totalInterruption = Object.values(stats).reduce((a, c) => a + c.interruption, 0);

  if (loading) return <p className="text-center py-8 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center py-8 text-red-500">Error: {error}</p>;

  return (
    <>
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-black mb-6">
          <thead>
            <tr>
              {['#', 'Date', 'Start', 'Stop', 'Int.', 'Delta', 'Phase', 'Comments', 'Por', ''].map((h) => (
                <th key={h} className="border border-black p-1.5 text-center text-xs font-bold bg-gray-50 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => {
              const row = getRow(log.id);
              const isDirty = !!drafts[log.id];
              const isSaving = !!saving[log.id];
              return (
              <tr key={log.id} className={isDirty ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                <td className="border border-black p-1 text-center font-mono text-xs bg-gray-100 w-6">{idx + 1}</td>
                <td className="border border-black p-0">
                  <input type="date" value={row.date}
                    onChange={(e) => handleChange(log.id, 'date', e.target.value)}
                    className="w-full p-1 text-xs bg-transparent outline-none" />
                </td>
                <td className="border border-black p-0 w-20">
                  <input type="time" value={row.start}
                    onChange={(e) => handleChange(log.id, 'start', e.target.value)}
                    className="w-full p-1 text-xs bg-transparent outline-none font-mono" />
                </td>
                <td className="border border-black p-0 w-20">
                  <input type="time" value={row.stop}
                    onChange={(e) => handleChange(log.id, 'stop', e.target.value)}
                    className="w-full p-1 text-xs bg-transparent outline-none font-mono" />
                </td>
                <td className="border border-black p-0 w-16">
                  <input type="number" min="0" value={row.interruption}
                    onChange={(e) => handleChange(log.id, 'interruption', e.target.value)}
                    className="w-full p-1 text-xs bg-transparent outline-none text-center" />
                </td>
                <td className="border border-black p-1 w-16 bg-gray-100 font-mono text-center text-xs font-bold">
                  {row.delta}
                </td>
                <td className="border border-black p-0 w-28">
                  <select value={row.phase}
                    onChange={(e) => handleChange(log.id, 'phase', e.target.value)}
                    className="w-full p-1 text-xs bg-transparent outline-none appearance-none">
                    {PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </td>
                <td className="border border-black p-0">
                  <input type="text" value={row.comments}
                    onChange={(e) => handleChange(log.id, 'comments', e.target.value)}
                    className="w-full p-1 text-xs bg-transparent outline-none" placeholder="..." />
                </td>
                <td className="border border-black p-1 w-20 text-xs text-gray-500 text-center">
                  {profiles[log.createdBy] || ''}
                </td>
                <td className="border border-black p-1 text-center w-24">
                  <div className="flex items-center justify-center gap-1">
                    {isDirty && (
                      <button
                        onClick={() => handleSave(log.id)}
                        disabled={isSaving}
                        className="text-xs font-bold px-2 py-1 bg-black text-white hover:bg-gray-800 disabled:opacity-50">
                        {isSaving ? '...' : 'Save'}
                      </button>
                    )}
                    <button onClick={() => setConfirmId(log.id)}
                      className="text-red-500 hover:text-red-700 font-bold px-1 text-lg leading-none">&times;</button>
                  </div>
                </td>
              </tr>
              );
            })}
            <tr>
              <td colSpan="10" className="border border-black p-2 text-center bg-gray-50">
                <button onClick={handleAdd} className="text-blue-600 font-bold hover:underline">+ Add Row</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 border-b-2 border-black inline-block">Cálculos por Fase</h2>
        <div className="w-full overflow-x-auto">
          <table className="border-collapse border border-black w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 text-left">Fase</th>
                <th className="border border-black p-2 text-right">Tiempo Efectivo (min)</th>
                <th className="border border-black p-2 text-right">Tiempo Muerto (min)</th>
              </tr>
            </thead>
            <tbody>
              {PHASES.map((phase) => (
                <tr key={phase} className="hover:bg-gray-50">
                  <td className="border border-black p-2 font-medium">{phase}</td>
                  <td className="border border-black p-2 text-right font-mono">
                    {stats[phase].delta > 0 ? stats[phase].delta : '-'}
                  </td>
                  <td className="border border-black p-2 text-right font-mono text-gray-600">
                    {stats[phase].interruption > 0 ? stats[phase].interruption : '-'}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-200 font-bold border-t-2 border-black">
                <td className="border border-black p-2 uppercase">Total</td>
                <td className="border border-black p-2 text-right font-mono text-lg">{totalDelta}</td>
                <td className="border border-black p-2 text-right font-mono text-lg">{totalInterruption}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    {confirmId && (
      <ConfirmDialog
        message="¿Seguro que quieres eliminar esta fila? Esta acción no se puede deshacer."
        onConfirm={() => { deleteLog(confirmId); setConfirmId(null); }}
        onCancel={() => setConfirmId(null)}
      />
    )}
    </>
  );
}
