import { useState, useEffect } from 'react';
import './App.css';

import { useAuth } from './hooks/useAuth';
import { useProjects } from './hooks/useProjects';
import { useTimeLogs } from './hooks/useTimeLogs';
import { useDefectLogs } from './hooks/useDefectLogs';
import { usePlanSummary } from './hooks/usePlanSummary';

import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { UserMenu } from './components/UserMenu';
import { ProjectHeader } from './components/ProjectHeader';
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
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'

  const [currentProject, setCurrentProject] = useState(null);
  const [headerDate, setHeaderDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('time');

  const { projects, loading: projectsLoading, createProject } = useProjects();

  const { logs: timeLogs, loading: timeLoading, error: timeError, addLog: addTimeLog, updateLog: updateTimeLog, deleteLog: deleteTimeLog } =
    useTimeLogs(currentProject);

  const { logs: defectLogs, loading: defectLoading, error: defectError, addLog: addDefectLog, updateLog: updateDefectLog, deleteLog: deleteDefectLog } =
    useDefectLogs(currentProject);

  const { plan, loading: planLoading, error: planError, updatePlan } =
    usePlanSummary(currentProject);

  useEffect(() => {
    if (projects.length > 0 && !currentProject) {
      setCurrentProject(projects[0]);
    }
  }, [projects, currentProject]);

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
        <p className="text-gray-500 text-sm uppercase tracking-widest">Cargando...</p>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    if (authView === 'register') {
      return (
        <RegisterPage
          onSignUp={signUp}
          onGoToLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <LoginPage
        onSignIn={signIn}
        onGoToRegister={() => setAuthView('register')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto bg-white shadow-lg border border-black p-8">

        <div className="text-center mb-6 relative">
          <div className="absolute top-0 right-0">
            <UserMenu user={user} onSignOut={signOut} />
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">PSP Tracker</h1>
          <div className="w-full h-0.5 bg-black mb-6"></div>
          {projectsLoading ? (
            <p className="text-gray-500">Loading projects...</p>
          ) : (
            <ProjectHeader
              projects={projects}
              currentProject={currentProject || ''}
              setCurrentProject={setCurrentProject}
              headerDate={headerDate}
              setHeaderDate={setHeaderDate}
              createProject={createProject}
            />
          )}
        </div>

        <div className="flex border-b-2 border-black mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 font-bold text-sm uppercase tracking-wide transition-colors ${
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
          />
        )}

      </div>
    </div>
  );
}

export default App;
