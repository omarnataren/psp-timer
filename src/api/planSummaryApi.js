import api from '../lib/axios';
import { PHASES, EMPTY_PROJECT_PLAN } from '../constants';

const rowsToNestedPlan = (rows) => {
  const plan = EMPTY_PROJECT_PLAN();
  rows.forEach((row) => {
    if (plan[row.section] && PHASES.includes(row.phase)) {
      plan[row.section][row.phase] = {
        plan: row.plan ?? 0,
        aLaFecha: row.a_la_fecha ?? 0,
      };
    }
  });
  return plan;
};

export const getPlanSummary = (projectName) =>
  api
    .get('/plan_summary', { params: { project_name: `eq.${projectName}`, select: '*' } })
    .then((res) => rowsToNestedPlan(res.data));

export const upsertPlanRow = (projectName, section, phase, plan, aLaFecha) =>
  api.post(
    '/plan_summary',
    { project_name: projectName, section, phase, plan, a_la_fecha: aLaFecha },
    { headers: { Prefer: 'resolution=merge-duplicates,return=representation' } }
  );
