import { useState } from 'react';
import { PHASES, DEFECT_TYPES, INITIAL_DEFECT_ROW } from '../constants';
import { ConfirmDialog } from './ConfirmDialog';

export function DefectRecordingLog({ logs, loading, error, addLog, updateLog, deleteLog, headerDate, profiles = {} }) {
  const [drafts, setDrafts] = useState({});
  const [saving, setSaving] = useState({});
  const [confirmId, setConfirmId] = useState(null);

  const getRow = (id) => drafts[id] ?? logs.find((r) => r.id === id);

  const handleChange = (id, field, value) => {
    const base = getRow(id);
    if (!base) return;
    setDrafts((prev) => ({ ...prev, [id]: { ...base, [field]: value } }));
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
    const newRow = { ...INITIAL_DEFECT_ROW, date: headerDate };
    addLog(newRow);
  };

  const totalFixTime = logs.reduce((acc, r) => acc + (Number(r.fixTime) || 0), 0);

  if (loading) return <p className="text-center py-8 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center py-8 text-red-500">Error: {error}</p>;

  return (
    <>
    <div>
      <div className="mb-6 border border-black p-3 inline-block text-sm bg-gray-50">
        <p className="font-bold mb-1">Defect Types</p>
        {DEFECT_TYPES.map((t) => <p key={t.value}>{t.label}</p>)}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-black mb-6">
          <thead>
            <tr>
              {['#', 'Date', 'Type', 'Injected', 'Removed', 'Fix Time', 'Description', 'Por', ''].map((h) => (
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
                <td className="border border-black p-0 w-32">
                  <select value={row.type}
                    onChange={(e) => handleChange(log.id, 'type', Number(e.target.value))}
                    className="w-full p-1 text-xs bg-transparent outline-none appearance-none">
                    {DEFECT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </td>
                <td className="border border-black p-0 w-28">
                  <select value={row.injected}
                    onChange={(e) => handleChange(log.id, 'injected', e.target.value)}
                    className="w-full p-1 text-xs bg-transparent outline-none appearance-none">
                    {PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </td>
                <td className="border border-black p-0 w-28">
                  <select value={row.removed}
                    onChange={(e) => handleChange(log.id, 'removed', e.target.value)}
                    className="w-full p-1 text-xs bg-transparent outline-none appearance-none">
                    {PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </td>
                <td className="border border-black p-0 w-20">
                  <input type="number" min="0" value={row.fixTime}
                    onChange={(e) => handleChange(log.id, 'fixTime', e.target.value)}
                    className="w-full p-1 text-xs bg-transparent outline-none text-center" />
                </td>
                <td className="border border-black p-0">
                  <input type="text" value={row.description}
                    onChange={(e) => handleChange(log.id, 'description', e.target.value)}
                    className="w-full p-1 text-xs bg-transparent outline-none"
                    placeholder="Brief error description..." />
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
              <td colSpan="9" className="border border-black p-2 text-center bg-gray-50">
                <button onClick={handleAdd} className="text-blue-600 font-bold hover:underline">+ Add Defect</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 border-b-2 border-black inline-block">Resumen de Defectos</h2>
        <div className="flex gap-8 flex-wrap">
          <div className="overflow-x-auto">
            <p className="font-semibold mb-2 text-sm">Por Type</p>
            <table className="border-collapse border border-black text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-2 text-left">Type</th>
                  <th className="border border-black p-2 text-right">Count</th>
                  <th className="border border-black p-2 text-right">Fix Time (min)</th>
                </tr>
              </thead>
              <tbody>
                {DEFECT_TYPES.map((t) => {
                  const rows = logs.filter((r) => Number(r.type) === t.value);
                  if (rows.length === 0) return null;
                  return (
                    <tr key={t.value} className="hover:bg-gray-50">
                      <td className="border border-black p-2">{t.label}</td>
                      <td className="border border-black p-2 text-right font-mono">{rows.length}</td>
                      <td className="border border-black p-2 text-right font-mono">
                        {rows.reduce((a, r) => a + (Number(r.fixTime) || 0), 0)}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-200 font-bold">
                  <td className="border border-black p-2">Total</td>
                  <td className="border border-black p-2 text-right font-mono">{logs.length}</td>
                  <td className="border border-black p-2 text-right font-mono">{totalFixTime}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto">
            <p className="font-semibold mb-2 text-sm">Por Fase (Introduced / Removed)</p>
            <table className="border-collapse border border-black text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-2 text-left">Phase</th>
                  <th className="border border-black p-2 text-right">Introduced</th>
                  <th className="border border-black p-2 text-right">Removed</th>
                </tr>
              </thead>
              <tbody>
                {PHASES.map((phase) => {
                  const introduced = logs.filter((r) => r.injected === phase).length;
                  const removed = logs.filter((r) => r.removed === phase).length;
                  return (
                    <tr key={phase} className="hover:bg-gray-50">
                      <td className="border border-black p-2 font-medium">{phase}</td>
                      <td className="border border-black p-2 text-right font-mono">
                        {introduced > 0 ? introduced : '-'}
                      </td>
                      <td className="border border-black p-2 text-right font-mono">
                        {removed > 0 ? removed : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    {confirmId && (
      <ConfirmDialog
        message="¿Seguro que quieres eliminar este defecto? Esta acción no se puede deshacer."
        onConfirm={() => { deleteLog(confirmId); setConfirmId(null); }}
        onCancel={() => setConfirmId(null)}
      />
    )}
    </>
  );
}
