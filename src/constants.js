export const PHASES = [
  'Planning',
  'Design',
  'Design Review',
  'Code',
  'Code Review',
  'Compile',
  'Test',
  'Postmortem',
];

export const DEFECT_TYPES = [
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

export const INITIAL_TIME_ROW = {
  date: '',
  start: '',
  stop: '',
  interruption: 0,
  delta: 0,
  phase: 'Planning',
  comments: '',
};

export const INITIAL_DEFECT_ROW = {
  date: '',
  type: 10,
  injected: 'Planning',
  removed: 'Planning',
  fixTime: 0,
  description: '',
};

export const EMPTY_PLAN = () =>
  PHASES.reduce((acc, phase) => {
    acc[phase] = { plan: 0, aLaFecha: 0 };
    return acc;
  }, {});

export const EMPTY_PROJECT_PLAN = () => ({
  time: EMPTY_PLAN(),
  defectsIntroduced: EMPTY_PLAN(),
  defectsSolved: EMPTY_PLAN(),
});

export const calculateDelta = (start, stop, interruption) => {
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
