import { useState, useEffect, useCallback, useRef } from 'react';
import { getPlanSummary, upsertPlanRow } from '../api/planSummaryApi';
import { EMPTY_PROJECT_PLAN } from '../constants';

export function usePlanSummary(projectName) {
  const [plan, setPlan] = useState(EMPTY_PROJECT_PLAN());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const planRef = useRef(plan);

  useEffect(() => {
    planRef.current = plan;
  }, [plan]);

  useEffect(() => {
    if (!projectName) return;
    setLoading(true);
    getPlanSummary(projectName)
      .then((data) => { setPlan(data); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [projectName]);

  const updatePlan = useCallback(async (section, phase, field, value) => {
    const newVal = Number(value) || 0;
    const currentRow = planRef.current[section]?.[phase] ?? { plan: 0, aLaFecha: 0 };
    const mergedRow = { ...currentRow, [field]: newVal };

    setPlan((prev) => ({
      ...prev,
      [section]: { ...prev[section], [phase]: mergedRow },
    }));

    await upsertPlanRow(projectName, section, phase, mergedRow.plan, mergedRow.aLaFecha)
      .catch((err) => setError(err.message));
  }, [projectName]);

  return { plan, loading, error, updatePlan };
}
