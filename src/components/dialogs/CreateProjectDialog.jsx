import { useState, useEffect } from 'react';

export function CreateProjectDialog({ teams, onConfirm, onCancel }) {
  const [name, setName] = useState('');
  const [teamId, setTeamId] = useState(teams[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (teams.length && !teamId) setTeamId(teams[0].id);
  }, [teams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !teamId) return;
    setError('');
    setLoading(true);
    try {
      await onConfirm(name.trim(), teamId);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white border border-black shadow-lg p-8 w-full max-w-sm font-sans">
        <h2 className="text-lg font-bold uppercase tracking-wider mb-6">Nuevo Proyecto</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-1">Nombre</label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Mi proyecto"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-1">Equipo</label>
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex justify-end gap-3 mt-2">
            <button type="button" onClick={onCancel}
              className="px-4 py-2 text-sm font-bold uppercase tracking-wide border border-black hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit" disabled={loading || !teams.length}
              className="px-4 py-2 text-sm font-bold uppercase tracking-wide bg-black text-white hover:bg-gray-800 disabled:opacity-50">
              {loading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
