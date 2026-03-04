import { useState, useEffect } from 'react';
import { UserMenu } from './UserMenu';
import { TeamView } from './TeamView';
import { CreateProjectDialog } from './dialogs/CreateProjectDialog';
import { CreateTeamDialog } from './dialogs/CreateTeamDialog';
import { JoinTeamDialog } from './dialogs/JoinTeamDialog';
import { getAllProjects } from '../api/projectsApi';

export function HomePage({ user, profile, teams, loadingTeams, createTeam, joinTeam, createProject, onOpenProject, onSignOut }) {
  const [tab, setTab] = useState('projects'); // 'projects' | 'teams'
  const [dialog, setDialog] = useState(null); // null | 'createProject' | 'createTeam' | 'joinTeam'
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const fetchProjects = () => {
    setLoadingProjects(true);
    getAllProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoadingProjects(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreateProject = async (name, teamId) => {
    await createProject(name, teamId);
    fetchProjects();
    setDialog(null);
  };

  const handleCreateTeam = async (name) => {
    await createTeam(name);
    setDialog(null);
  };

  const handleJoinTeam = async (code) => {
    await joinTeam(code);
    fetchProjects();
    setDialog(null);
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Usuario';

  // If a team is selected → show team detail
  if (selectedTeam) {
    return (
      <div className="min-h-screen p-3 sm:p-8 font-sans">
        <div className="max-w-5xl mx-auto bg-white shadow-lg border border-black p-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedTeam(null)}
              className="flex items-center gap-1 text-sm font-bold border border-black px-3 py-1.5 hover:bg-gray-100 transition-colors"
            >
              ← Equipos
            </button>
            <UserMenu user={user} onSignOut={onSignOut} />
          </div>
          <TeamView
            team={selectedTeam}
            onBack={() => setSelectedTeam(null)}
            onOpenProject={onOpenProject}
            currentUserId={user.id}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-8 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto bg-white shadow-lg border border-black p-8">

        {/* Top bar */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-widest">PSP Tracker</h1>
            <p className="text-xl mt-2 text-gray-700">
              Hola, <span className="font-bold">{displayName}</span>
            </p>
          </div>
          <UserMenu user={user} onSignOut={onSignOut} />
        </div>

        <div className="w-full h-0.5 bg-black mb-6" />

        {/* Tab nav + action button */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div className="flex gap-6">
            <button
              onClick={() => setTab('projects')}
              className={`pb-2 text-sm font-bold uppercase tracking-wide transition-all ${
                tab === 'projects'
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-400 border-b-2 border-transparent hover:text-gray-600'
              }`}
            >
              Proyectos
            </button>
            <button
              onClick={() => setTab('teams')}
              className={`pb-2 text-sm font-bold uppercase tracking-wide transition-all ${
                tab === 'teams'
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-400 border-b-2 border-transparent hover:text-gray-600'
              }`}
            >
              Equipos
            </button>
          </div>

          <div className="flex gap-2">
            {tab === 'projects' ? (
              <button
                onClick={() => setDialog('createProject')}
                className="text-sm font-bold uppercase tracking-wide border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
              >
                + Crear Proyecto
              </button>
            ) : (
              <>
                <button
                  onClick={() => setDialog('joinTeam')}
                  className="text-sm font-bold uppercase tracking-wide border border-black px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  Unirse
                </button>
                <button
                  onClick={() => setDialog('createTeam')}
                  className="text-sm font-bold uppercase tracking-wide border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
                >
                  + Crear Equipo
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tab content */}
        {tab === 'projects' && (
          <ProjectsTab
            projects={projects}
            loading={loadingProjects}
            onOpen={onOpenProject}
          />
        )}

        {tab === 'teams' && (
          <TeamsTab
            teams={teams}
            loading={loadingTeams}
            onSelectTeam={setSelectedTeam}
          />
        )}
      </div>

      {/* Dialogs */}
      {dialog === 'createProject' && (
        <CreateProjectDialog
          teams={teams}
          onConfirm={handleCreateProject}
          onCancel={() => setDialog(null)}
        />
      )}
      {dialog === 'createTeam' && (
        <CreateTeamDialog
          onConfirm={handleCreateTeam}
          onCancel={() => setDialog(null)}
        />
      )}
      {dialog === 'joinTeam' && (
        <JoinTeamDialog
          onConfirm={handleJoinTeam}
          onCancel={() => setDialog(null)}
        />
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProjectsTab({ projects, loading, onOpen }) {
  if (loading) return <p className="text-gray-400 text-sm py-8 text-center">Cargando proyectos...</p>;
  if (!projects.length) return (
    <p className="text-gray-400 text-sm py-8 text-center">
      No tienes proyectos aún. Crea uno con el botón de arriba.
    </p>
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <button
          key={`${p.teamId}-${p.name}`}
          onClick={() => onOpen({ name: p.name, teamId: p.teamId, teamName: p.teamName })}
          className="text-left p-4 border border-black hover:bg-black hover:text-white transition-colors group"
        >
          <p className="font-bold text-sm uppercase tracking-wide">{p.name}</p>
          <p className="text-xs mt-1 text-gray-500 group-hover:text-gray-300">{p.teamName}</p>
          <p className="text-xs text-gray-400 group-hover:text-gray-300 mt-0.5">
            {new Date(p.createdAt).toLocaleDateString('es-MX')}
          </p>
        </button>
      ))}
    </div>
  );
}

function TeamsTab({ teams, loading, onSelectTeam }) {
  if (loading) return <p className="text-gray-400 text-sm py-8 text-center">Cargando equipos...</p>;
  if (!teams.length) return (
    <p className="text-gray-400 text-sm py-8 text-center">
      No perteneces a ningún equipo aún.
    </p>
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {teams.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelectTeam(t)}
          className="text-left p-4 border border-black hover:bg-black hover:text-white transition-colors group"
        >
          <p className="font-bold text-sm uppercase tracking-wide">{t.name}</p>
          <p className="text-xs mt-1 font-mono text-gray-400 group-hover:text-gray-300">
            {t.inviteCode}
          </p>
        </button>
      ))}
    </div>
  );
}
