import { useState } from 'react';
import './App.css';

import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { useTeams, useTeamDetail } from './hooks/useTeams';
import { useTimeLogs } from './hooks/useTimeLogs';
import { useDefectLogs } from './hooks/useDefectLogs';
import { usePlanSummary } from './hooks/usePlanSummary';
import { useProjects } from './hooks/useProjects';

import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { UserMenu } from './components/UserMenu';
import { HomePage } from './components/HomePage';
import { TimeRecordingLog } from './components/TimeRecordingLog';
import { DefectRecordingLog } from './components/DefectRecordingLog';
import { ProjectPlanSummary } from './components/ProjectPlanSummary';

const TABS = [
  { id: 'time', label: 'Time Recording Log' },
  { id: 'defect', label: 'Defect Recording Log' },
  { id: 'plan', label: 'Project Plan Summary' },
];

function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const [authView, setAuthView] = useState('login');

  // View: 'home' | 'tracker'
  const [view, setView] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null); // { name, teamId, teamName }
  const [headerDate, setHeaderDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('time');

  const { profile } = useProfile(user);
  const { teams, loading: teamsLoading, createTeam, joinTeam } = useTeams(user);
  const { createProject } = useProjects(user);

  // Tracker data — only active when a project is selected
  const projectName = view === 'tracker' ? selectedProject?.name : null;
  const { profilesMap } = useTeamDetail(view === 'tracker' ? selectedProject?.teamId : null);

  const { logs: timeLogs, loading: timeLoading, error: timeError, addLog: addTimeLog, updateLog: updateTimeLog, deleteLog: deleteTimeLog } =
    useTimeLogs(projectName);
  const { logs: defectLogs, loading: defectLoading, error: defectError, addLog: addDefectLog, updateLog: updateDefectLog, deleteLog: deleteDefectLog } =
    useDefectLogs(projectName);
  const { plan, loading: planLoading, error: planError, updatePlan, savePlanRow } =
    usePlanSummary(projectName);

  const openProject = (projectInfo) => {
    setSelectedProject(projectInfo);
    setActiveTab('time');
    setView('tracker');
  };

  // ── Auth loading ──────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        <p className="text-gray-500 text-sm uppercase tracking-widest">Cargando...</p>
      </div>
    );
  }

  // ── Not authenticated ─────────────────────────────────────────────────────
  if (!user) {
    if (authView === 'register') {
      return <RegisterPage onSignUp={signUp} onGoToLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onSignIn={signIn} onGoToRegister={() => setAuthView('register')} />;
  }

  // ── Home ──────────────────────────────────────────────────────────────────
  if (view === 'home') {
    return (
      <HomePage
        user={user}
        profile={profile}
        teams={teams}
        loadingTeams={teamsLoading}
        createTeam={createTeam}
        joinTeam={joinTeam}
        createProject={createProject}
        onOpenProject={openProject}
        onSignOut={signOut}
      />
    );
  }

  // ── Tracker ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen p-3 sm:p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto bg-white shadow-lg border border-black p-4 sm:p-8">

        <div className="mb-6">
          {/* Top row: back + usermenu */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-1 text-sm font-bold border border-black px-3 py-1.5 hover:bg-gray-100 transition-colors"
            >
              ← Inicio
            </button>
            <UserMenu user={user} onSignOut={signOut} compact />
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider mb-1">PSP Tracker</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
              {selectedProject?.teamName} · {selectedProject?.name}
            </p>
          </div>
          <div className="w-full h-0.5 bg-black mb-4" />

          <div className="flex items-center justify-center gap-3">
            <label className="text-xs font-bold uppercase tracking-wide">Fecha:</label>
            <input
              type="date"
              value={headerDate}
              onChange={(e) => setHeaderDate(e.target.value)}
              className="border border-black px-2 py-1 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="flex overflow-x-auto border-b-2 border-black mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-3 sm:px-6 py-2 font-bold text-xs sm:text-sm uppercase tracking-wide transition-colors ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'time' && (
          <TimeRecordingLog
            logs={timeLogs}
            loading={timeLoading}
            error={timeError}
            addLog={addTimeLog}
            updateLog={updateTimeLog}
            deleteLog={deleteTimeLog}
            headerDate={headerDate}
            profiles={profilesMap}
          />
        )}

        {activeTab === 'defect' && (
          <DefectRecordingLog
            logs={defectLogs}
            loading={defectLoading}
            error={defectError}
            addLog={addDefectLog}
            updateLog={updateDefectLog}
            deleteLog={deleteDefectLog}
            headerDate={headerDate}
            profiles={profilesMap}
          />
        )}

        {activeTab === 'plan' && (
          <ProjectPlanSummary
            plan={plan}
            timeLogs={timeLogs}
            defectLogs={defectLogs}
            loading={planLoading}
            error={planError}
            updatePlan={updatePlan}
            savePlanRow={savePlanRow}
          />
        )}

      </div>
    </div>
  );
}

export default App;
