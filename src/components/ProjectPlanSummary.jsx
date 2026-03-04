import { PHASES, EMPTY_PROJECT_PLAN } from '../constants';

export function ProjectPlanSummary({ plan, timeLogs, defectLogs, loading, error, updatePlan }) {
  const currentPlan = plan || EMPTY_PROJECT_PLAN();

  const timeReal = PHASES.reduce((acc, phase) => {
    acc[phase] = timeLogs
      .filter((r) => r.phase === phase)
      .reduce((s, r) => s + (Number(r.delta) || 0), 0);
    return acc;
  }, {});

  const defIntroReal = PHASES.reduce((acc, phase) => {
    acc[phase] = defectLogs.filter((r) => r.injected === phase).length;
    return acc;
  }, {});

  const defSolvedReal = PHASES.reduce((acc, phase) => {
    acc[phase] = defectLogs.filter((r) => r.removed === phase).length;
    return acc;
  }, {});

  const pct = (aLaFecha, planVal) => {
    if (!planVal || planVal === 0) return '-';
    return Math.round((aLaFecha / planVal) * 100) + '%';
  };

  const SectionTable = ({ title, section, realData, unit }) => {
    const rows = PHASES.map((phase) => ({
      phase,
      plan: currentPlan[section]?.[phase]?.plan ?? 0,
      real: realData[phase] ?? 0,
      aLaFecha: currentPlan[section]?.[phase]?.aLaFecha ?? 0,
    }));
    const totalPlan = rows.reduce((a, r) => a + r.plan, 0);
    const totalReal = rows.reduce((a, r) => a + r.real, 0);
    const totalALaFecha = rows.reduce((a, r) => a + r.aLaFecha, 0);

    return (
      <div className="mb-8">
        <h3 className="font-bold text-base mb-2 uppercase tracking-wide border-b border-black inline-block pr-4">
          {title}
        </h3>
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
            {rows.map(({ phase, plan: planVal, real, aLaFecha }) => (
              <tr key={phase} className="hover:bg-gray-50">
                <td className="border border-black p-2">{phase}</td>
                <td className="border border-black p-0 w-28">
                  <input
                    type="number" min="0" value={planVal}
                    onChange={(e) => updatePlan(section, phase, 'plan', e.target.value)}
                    className="w-full p-2 bg-transparent outline-none text-right font-mono"
                  />
                </td>
                <td className="border border-black p-2 text-right font-mono bg-gray-50">
                  {real > 0 ? real : '-'}
                </td>
                <td className="border border-black p-0 w-28">
                  <input
                    type="number" min="0" value={aLaFecha}
                    onChange={(e) => updatePlan(section, phase, 'aLaFecha', e.target.value)}
                    className="w-full p-2 bg-transparent outline-none text-right font-mono"
                  />
                </td>
                <td className="border border-black p-2 text-right font-mono font-bold">
                  {pct(aLaFecha, planVal)}
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

  if (loading) return <p className="text-center py-8 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center py-8 text-red-500">Error: {error}</p>;

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">
        Los campos <strong>Plan</strong> y <strong>A la fecha</strong> son editables.{' '}
        <strong>Tiempo real</strong> se calcula automáticamente desde los logs.
      </p>
      <SectionTable title="Tiempo por Fase" section="time" realData={timeReal} unit="min" />
      <SectionTable title="Defectos Introducidos" section="defectsIntroduced" realData={defIntroReal} unit="#" />
      <SectionTable title="Defectos Solucionados" section="defectsSolved" realData={defSolvedReal} unit="#" />
    </div>
  );
}
