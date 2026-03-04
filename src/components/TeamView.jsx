import { useState } from 'react';
import { useTeamDetail } from '../hooks/useTeams';

export function TeamView({ team, onBack, onOpenProject, currentUserId }) {
  const { members, projects, loading } = useTeamDetail(team.id);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(team.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="font-sans">
      {/* Team name + invite code */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-widest">{team.name}</h2>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Código de invitación:</span>
          <span className="font-mono font-bold tracking-widest border border-black px-3 py-1 text-sm bg-gray-50">
            {team.inviteCode}
          </span>
          <button
            onClick={copyCode}
            className="text-xs font-bold uppercase tracking-wide border border-black px-2 py-1 hover:bg-gray-100 transition-colors"
          >
            {copied ? '✓ Copiado' : 'Copiar'}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Cargando...</p>
      ) : (
        <div className="flex gap-10 flex-wrap">
          {/* Members */}
          <div className="min-w-[220px]">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 border-b border-black pb-1">
              Participantes ({members.length})
            </h3>
            <ul className="flex flex-col gap-1">
              {members.map((m) => (
                <li key={m.userId} className="flex items-center gap-2 text-sm py-1">
                  <span className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs font-bold rounded-full">
                    {m.fullName?.[0]?.toUpperCase() || '?'}
                  </span>
                  <span>{m.fullName}</span>
                  {m.userId === currentUserId && (
                    <span className="text-xs text-gray-400">(tú)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div className="flex-1 min-w-[260px]">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 border-b border-black pb-1">
              Proyectos ({projects.length})
            </h3>
            {projects.length === 0 ? (
              <p className="text-sm text-gray-400">No hay proyectos aún.</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {projects.map((p) => (
                  <li key={p.name}>
                    <button
                      onClick={() => onOpenProject({ name: p.name, teamId: team.id, teamName: team.name })}
                      className="w-full text-left text-sm font-medium py-2 px-3 border border-transparent hover:border-black hover:bg-gray-50 transition-all"
                    >
                      {p.name}
                      <span className="ml-2 text-xs text-gray-400">→</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
