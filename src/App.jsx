import { useState, useEffect } from 'react';
import './App.css';

const PHASES = [
  'Planning',
  'Design',
  'Design Review',
  'Code',
  'Code Review',
  'Compile',
  'Test',
  'Postmortem',
];

const DEFECT_TYPES = [
  { value: 10, label: '10 – Documentation' },
  { value: 20, label: '20 – Syntax' },
  { value: 30, label: '30 – Build' },
  { value: 40, label: '40 – Assignment' },
  { value: 50, label: '50 – Interface' },
  { value: 60, label: '60 – Checking' },
  { value: 70, label: '70 – Data' },
  { value: 80, label: '80 – Function' },
  { value: 90, label: '90 – System' },
  { value: 100, label: '100 – Environment' },
];

const INITIAL_TIME_ROW = {
  id: '',
  date: '',
  start: '',
  stop: '',
  interruption: 0,
  delta: 0,
  phase: 'Planning',
  comments: '',
};

const INITIAL_DEFECT_ROW = {
  id: '',
  date: '',
  type: 10,
  injected: 'Planning',
  removed: 'Planning',
  fixTime: 0,
  description: '',
};

function ProjectHeader({ projects, currentProject, setCurrentProject, headerDate, setHeaderDate }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');

  return (
    <div>
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex-1 min-w-[300px]">
          <div className="flex items-center gap-2 mb-2">
            <label className="font-bold text-lg whitespace-nowrap">Project:</label>
            {!isCreating ? (
              <div className="flex gap-2 w-full">
                <select
                  className="flex-1 border-b-2 border-black bg-transparent px-2 py-1 outline-none appearance-none"
                  value={currentProject.name}
                  onChange={(e) => setCurrentProject(e.target.value)}
                >
                  {projects.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-3 py-1 bg-black text-white text-sm hover:bg-gray-800"
                >
                  New
                </button>
              </div>
            ) : (
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  className="flex-1 border-b-2 border-black px-2 py-1 outline-none"
                  placeholder="New project name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                />
                <button
                  onClick={() => {
                    if (newName.trim()) {
                      setCurrentProject(newName.trim(), true);
                      setNewName('');
                      setIsCreating(false);
                    }
                  }}
                  className="px-3 py-1 bg-green-600 text-white text-sm hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => { setIsCreating(false); setNewName(''); }}
                  className="px-3 py-1 bg-red-600 text-white text-sm hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-bold text-lg">Date:</label>
          <input
            type="date"
            className="border-b-2 border-black bg-transparent px-2 py-1 outline-none"
            value={headerDate}
            onChange={(e) => setHeaderDate(e.target.value)}
          />
        </div>
      </div>
      <div className="w-full h-0.5 bg-black mt-2"></div>
    </div>
  );
}

function TimeRecordingLog({ timeLogs, setTimeLogs, currentProject, headerDate }) {
  const currentLogs = timeLogs[currentProject] || [];

  const calculateDelta = (start, stop, interruption) => {
    if (!start || !stop) return 0;
    const [startH, startM] = start.split(':').map(Number);
    const [stopH, stopM] = stop.split(':').map(Number);
    if (isNaN(startH) || isNaN(startM) || isNaN(stopH) || isNaN(stopM)) return 0;
    const startMin = startH * 60 + startM;
    const stopMin = stopH * 60 + stopM;
    let diff = stopMin - startMin;
    if (diff < 0) diff += 24 * 60;
    return Math.max(0, diff - (Number(interruption) || 0));
  };

  const handleChange = (id, field, value) => {
    const updated = currentLogs.map((row) => {
      if (row.id !== id) return row;
      const updatedRow = { ...row, [field]: value };
      if (['start', 'stop', 'interruption'].includes(field)) {
        updatedRow.delta = calculateDelta(updatedRow.start, updatedRow.stop, updatedRow.interruption);
      }
      return updatedRow;
    });
    setTimeLogs({ ...timeLogs, [currentProject]: updated });
  };

  const addRow = () => {
    const newRow = { ...INITIAL_TIME_ROW, id: Date.now().toString(), date: headerDate };
    setTimeLogs({ ...timeLogs, [currentProject]: [...currentLogs, newRow] });
  };

  const deleteRow = (id) => {
    setTimeLogs({ ...timeLogs, [currentProject]: currentLogs.filter((r) => r.id !== id) });
  };

  const stats = PHASES.reduce((acc, phase) => {
    acc[phase] = { delta: 0, interruption: 0 };
    return acc;
  }, {});
  currentLogs.forEach((row) => {
    if (stats[row.phase]) {
      stats[row.phase].delta += Number(row.delta) || 0;
      stats[row.phase].interruption += Number(row.interruption) || 0;
    }
  });
  const totalDelta = Object.values(stats).reduce((a, c) => a + c.delta, 0);
  const totalInterruption = Object.values(stats).reduce((a, c) => a + c.interruption, 0);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-black mb-6">
          <thead>
            <tr>
              {['#', 'Date', 'Start', 'Stop', 'Interruption (min)', 'Delta (min)', 'Phase', 'Comments', ''].map((h) => (
                <th key={h} className="border border-black p-2 text-center text-sm font-bold bg-gray-50">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((row, idx) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="border border-black p-2 text-center font-mono text-sm bg-gray-100 w-8">{idx + 1}</td>
                <td className="border border-black p-0">
                  <input
                    type="date"
                    value={row.date}
                    onChange={(e) => handleChange(row.id, 'date', e.target.value)}
                    className="w-full p-2 bg-transparent outline-none"
                  />
                </td>
                <td className="border border-black p-0 w-24">
                  <input
                    type="time"
                    value={row.start}
                    onChange={(e) => handleChange(row.id, 'start', e.target.value)}
                    className="w-full p-2 bg-transparent outline-none font-mono"
                  />
                </td>
                <td className="border border-black p-0 w-24">
                  <input
                    type="time"
                    value={row.stop}
                    onChange={(e) => handleChange(row.id, 'stop', e.target.value)}
                    className="w-full p-2 bg-transparent outline-none font-mono"
                  />
                </td>
                <td className="border border-black p-0 w-28">
                  <input
                    type="number"
                    min="0"
                    value={row.interruption}
                    onChange={(e) => handleChange(row.id, 'interruption', e.target.value)}
                    className="w-full p-2 bg-transparent outline-none text-center"
                  />
                </td>
                <td className="border border-black p-2 w-24 bg-gray-100 font-mono text-center font-bold">{row.delta}</td>
                <td className="border border-black p-0 w-36">
                  <select
                    value={row.phase}
                    onChange={(e) => handleChange(row.id, 'phase', e.target.value)}
                    className="w-full p-2 bg-transparent outline-none appearance-none"
                  >
                    {PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </td>
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={row.comments}
                    onChange={(e) => handleChange(row.id, 'comments', e.target.value)}
                    className="w-full p-2 bg-transparent outline-none"
                    placeholder="..."
                  />
                </td>
                <td className="border border-black p-1 text-center w-10">
                  <button onClick={() => deleteRow(row.id)} className="text-red-500 hover:text-red-700 font-bold px-2">&times;</button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="9" className="border border-black p-2 text-center bg-gray-50">
                <button onClick={addRow} className="text-blue-600 font-bold hover:underline">+ Add Row</button>
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
                  <td className="border border-black p-2 text-right font-mono">{stats[phase].delta > 0 ? stats[phase].delta : '-'}</td>
                  <td className="border border-black p-2 text-right font-mono text-gray-600">{stats[phase].interruption > 0 ? stats[phase].interruption : '-'}</td>
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
  );
}

function DefectRecordingLog({ defectLogs, setDefectLogs, currentProject, headerDate }) {
  const currentLogs = defectLogs[currentProject] || [];

  const handleChange = (id, field, value) => {
    const updated = currentLogs.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setDefectLogs({ ...defectLogs, [currentProject]: updated });
  };

  const addRow = () => {
    const newRow = { ...INITIAL_DEFECT_ROW, id: Date.now().toString(), date: headerDate };
    setDefectLogs({ ...defectLogs, [currentProject]: [...currentLogs, newRow] });
  };

  const deleteRow = (id) => {
    setDefectLogs({ ...defectLogs, [currentProject]: currentLogs.filter((r) => r.id !== id) });
  };

  const totalFixTime = currentLogs.reduce((acc, r) => acc + (Number(r.fixTime) || 0), 0);

  return (
    <div>
      <div className="mb-6 border border-black p-3 inline-block text-sm bg-gray-50">
        <p className="font-bold mb-1">Defect Types</p>
        {DEFECT_TYPES.map((t) => (
          <p key={t.value}>{t.label}</p>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-black mb-6">
          <thead>
            <tr>
              {['#', 'Date', 'Type', 'Injected', 'Removed', 'Fix Time (min)', 'Description', ''].map((h) => (
                <th key={h} className="border border-black p-2 text-center text-sm font-bold bg-gray-50">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((row, idx) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="border border-black p-2 text-center font-mono font-bold bg-gray-100 w-8">{idx + 1}</td>
                <td className="border border-black p-0">
                  <input
                    type="date"
                    value={row.date}
                    onChange={(e) => handleChange(row.id, 'date', e.target.value)}
                    className="w-full p-2 bg-transparent outline-none"
                  />
                </td>
                <td className="border border-black p-0 w-40">
                  <select
                    value={row.type}
                    onChange={(e) => handleChange(row.id, 'type', Number(e.target.value))}
                    className="w-full p-2 bg-transparent outline-none appearance-none"
                  >
                    {DEFECT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </td>
                <td className="border border-black p-0 w-36">
                  <select
                    value={row.injected}
                    onChange={(e) => handleChange(row.id, 'injected', e.target.value)}
                    className="w-full p-2 bg-transparent outline-none appearance-none"
                  >
                    {PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </td>
                <td className="border border-black p-0 w-36">
                  <select
                    value={row.removed}
                    onChange={(e) => handleChange(row.id, 'removed', e.target.value)}
                    className="w-full p-2 bg-transparent outline-none appearance-none"
                  >
                    {PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </td>
                <td className="border border-black p-0 w-28">
                  <input
                    type="number"
                    min="0"
                    value={row.fixTime}
                    onChange={(e) => handleChange(row.id, 'fixTime', e.target.value)}
                    className="w-full p-2 bg-transparent outline-none text-center"
                  />
                </td>
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={row.description}
                    onChange={(e) => handleChange(row.id, 'description', e.target.value)}
                    className="w-full p-2 bg-transparent outline-none"
                    placeholder="Brief error description..."
                  />
                </td>
                <td className="border border-black p-1 text-center w-10">
                  <button onClick={() => deleteRow(row.id)} className="text-red-500 hover:text-red-700 font-bold px-2">&times;</button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="8" className="border border-black p-2 text-center bg-gray-50">
                <button onClick={addRow} className="text-blue-600 font-bold hover:underline">+ Add Defect</button>
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
                  const rows = currentLogs.filter((r) => Number(r.type) === t.value);
                  if (rows.length === 0) return null;
                  return (
                    <tr key={t.value} className="hover:bg-gray-50">
                      <td className="border border-black p-2">{t.label}</td>
                      <td className="border border-black p-2 text-right font-mono">{rows.length}</td>
                      <td className="border border-black p-2 text-right font-mono">{rows.reduce((a, r) => a + (Number(r.fixTime) || 0), 0)}</td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-200 font-bold">
                  <td className="border border-black p-2">Total</td>
                  <td className="border border-black p-2 text-right font-mono">{currentLogs.length}</td>
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
                  const introduced = currentLogs.filter((r) => r.injected === phase).length;
                  const removed = currentLogs.filter((r) => r.removed === phase).length;
                  return (
                    <tr key={phase} className="hover:bg-gray-50">
                      <td className="border border-black p-2 font-medium">{phase}</td>
                      <td className="border border-black p-2 text-right font-mono">{introduced > 0 ? introduced : '-'}</td>
                      <td className="border border-black p-2 text-right font-mono">{removed > 0 ? removed : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const EMPTY_PLAN = () =>
  PHASES.reduce((acc, phase) => {
    acc[phase] = { plan: 0, aLaFecha: 0 };
    return acc;
  }, {});

const EMPTY_PROJECT_PLAN = () => ({
  time: EMPTY_PLAN(),
  defectsIntroduced: EMPTY_PLAN(),
  defectsSolved: EMPTY_PLAN(),
});

function ProjectPlanSummary({ timeLogs, defectLogs, planSummary, setPlanSummary, currentProject }) {
  const currentPlan = planSummary[currentProject] || EMPTY_PROJECT_PLAN();
  const currentTimeLogs = timeLogs[currentProject] || [];
  const currentDefectLogs = defectLogs[currentProject] || [];

  const handleChange = (section, phase, field, value) => {
    const updated = {
      ...currentPlan,
      [section]: {
        ...currentPlan[section],
        [phase]: { ...currentPlan[section][phase], [field]: Number(value) || 0 },
      },
    };
    setPlanSummary({ ...planSummary, [currentProject]: updated });
  };

  const timeReal = PHASES.reduce((acc, phase) => {
    acc[phase] = currentTimeLogs
      .filter((r) => r.phase === phase)
      .reduce((s, r) => s + (Number(r.delta) || 0), 0);
    return acc;
  }, {});

  const defIntroReal = PHASES.reduce((acc, phase) => {
    acc[phase] = currentDefectLogs.filter((r) => r.injected === phase).length;
    return acc;
  }, {});

  const defSolvedReal = PHASES.reduce((acc, phase) => {
    acc[phase] = currentDefectLogs.filter((r) => r.removed === phase).length;
    return acc;
  }, {});

  const pct = (aLaFecha, plan) => {
    if (!plan || plan === 0) return '-';
    return Math.round((aLaFecha / plan) * 100) + '%';
  };

  const SectionTable = ({ title, section, realData, unit }) => {
    const rows = PHASES.map((phase) => ({
      phase,
      plan: currentPlan[section][phase]?.plan ?? 0,
      real: realData[phase] ?? 0,
      aLaFecha: currentPlan[section][phase]?.aLaFecha ?? 0,
    }));
    const totalPlan = rows.reduce((a, r) => a + r.plan, 0);
    const totalReal = rows.reduce((a, r) => a + r.real, 0);
    const totalALaFecha = rows.reduce((a, r) => a + r.aLaFecha, 0);

    return (
      <div className="mb-8">
        <h3 className="font-bold text-base mb-2 uppercase tracking-wide border-b border-black inline-block pr-4">{title}</h3>
        <table className="border-collapse border border-black w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 text-left">Phase</th>
              <th className="border border-black p-2 text-right">Plan ({unit})</th>
              <th className="border border-black p-2 text-right">Tiempo real ({unit})</th>
              <th className="border border-black p-2 text-right">A la fecha ({unit})</th>
              <th className="border border-black p-2 text-right">% a la fecha</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ phase, plan, real, aLaFecha }) => (
              <tr key={phase} className="hover:bg-gray-50">
                <td className="border border-black p-2">{phase}</td>
                <td className="border border-black p-0 w-28">
                  <input
                    type="number" min="0"
                    value={plan}
                    onChange={(e) => handleChange(section, phase, 'plan', e.target.value)}
                    className="w-full p-2 bg-transparent outline-none text-right font-mono"
                  />
                </td>
                <td className="border border-black p-2 text-right font-mono bg-gray-50">
                  {real > 0 ? real : '-'}
                </td>
                <td className="border border-black p-0 w-28">
                  <input
                    type="number" min="0"
                    value={aLaFecha}
                    onChange={(e) => handleChange(section, phase, 'aLaFecha', e.target.value)}
                    className="w-full p-2 bg-transparent outline-none text-right font-mono"
                  />
                </td>
                <td className="border border-black p-2 text-right font-mono font-bold">
                  {pct(aLaFecha, plan)}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-200 font-bold border-t-2 border-black">
              <td className="border border-black p-2">Total</td>
              <td className="border border-black p-2 text-right font-mono">{totalPlan}</td>
              <td className="border border-black p-2 text-right font-mono bg-gray-300">{totalReal}</td>
              <td className="border border-black p-2 text-right font-mono">{totalALaFecha}</td>
              <td className="border border-black p-2 text-right font-mono">{pct(totalALaFecha, totalPlan)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">Los campos <strong>Plan</strong> y <strong>A la fecha</strong> son editables. <strong>Tiempo real</strong> se calcula automáticamente desde los logs.</p>
      <SectionTable title="Tiempo por Fase" section="time" realData={timeReal} unit="min" />
      <SectionTable title="Defectos Introducidos" section="defectsIntroduced" realData={defIntroReal} unit="#" />
      <SectionTable title="Defectos Solucionados" section="defectsSolved" realData={defSolvedReal} unit="#" />
    </div>
  );
}

function App() {
  const [projects, setProjects] = useState(['Default Project']);
  const [currentProject, setCurrentProject] = useState('Default Project');
  const [headerDate, setHeaderDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeLogs, setTimeLogs] = useState({ 'Default Project': [] });
  const [defectLogs, setDefectLogs] = useState({ 'Default Project': [] });
  const [planSummary, setPlanSummary] = useState({ 'Default Project': EMPTY_PROJECT_PLAN() });
  const [activeTab, setActiveTab] = useState('time');

  useEffect(() => {
    const p = localStorage.getItem('psp_projects');
    const tl = localStorage.getItem('psp_timeLogs');
    const dl = localStorage.getItem('psp_defectLogs');
    const ps = localStorage.getItem('psp_planSummary');
    const d = localStorage.getItem('psp_headerDate');
    const cp = localStorage.getItem('psp_currentProject');
    if (p) setProjects(JSON.parse(p));
    if (tl) setTimeLogs(JSON.parse(tl));
    if (dl) setDefectLogs(JSON.parse(dl));
    if (ps) setPlanSummary(JSON.parse(ps));
    if (d) setHeaderDate(d);
    if (cp) setCurrentProject(cp);
  }, []);

  useEffect(() => {
    localStorage.setItem('psp_projects', JSON.stringify(projects));
    localStorage.setItem('psp_timeLogs', JSON.stringify(timeLogs));
    localStorage.setItem('psp_defectLogs', JSON.stringify(defectLogs));
    localStorage.setItem('psp_planSummary', JSON.stringify(planSummary));
    localStorage.setItem('psp_headerDate', headerDate);
    localStorage.setItem('psp_currentProject', currentProject);
  }, [projects, timeLogs, defectLogs, planSummary, headerDate, currentProject]);

  const handleSetProject = (nameOrNew, isNew = false) => {
    if (isNew) {
      if (!projects.includes(nameOrNew)) {
        setProjects([...projects, nameOrNew]);
        setTimeLogs({ ...timeLogs, [nameOrNew]: [] });
        setDefectLogs({ ...defectLogs, [nameOrNew]: [] });
        setPlanSummary({ ...planSummary, [nameOrNew]: EMPTY_PROJECT_PLAN() });
      }
    }
    setCurrentProject(nameOrNew);
  };

  const TABS = [
    { id: 'time', label: 'Time Recording Log' },
    { id: 'defect', label: 'Defect Recording Log' },
    { id: 'plan', label: 'Project Plan Summary' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto bg-white shadow-lg border border-black p-8">

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">PSP Tracker</h1>
          <div className="w-full h-0.5 bg-black mb-6"></div>
          <ProjectHeader
            projects={projects}
            currentProject={{ name: currentProject }}
            setCurrentProject={handleSetProject}
            headerDate={headerDate}
            setHeaderDate={setHeaderDate}
          />
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
            timeLogs={timeLogs}
            setTimeLogs={setTimeLogs}
            currentProject={currentProject}
            headerDate={headerDate}
          />
        )}
        {activeTab === 'defect' && (
          <DefectRecordingLog
            defectLogs={defectLogs}
            setDefectLogs={setDefectLogs}
            currentProject={currentProject}
            headerDate={headerDate}
          />
        )}
        {activeTab === 'plan' && (
          <ProjectPlanSummary
            timeLogs={timeLogs}
            defectLogs={defectLogs}
            planSummary={planSummary}
            setPlanSummary={setPlanSummary}
            currentProject={currentProject}
          />
        )}

      </div>
    </div>
  );
}

export default App;
