import api from '../lib/axios';

const toDB = (row, projectName) => ({
  project_name: projectName,
  date: row.date,
  start: row.start,
  stop: row.stop,
  interruption: Number(row.interruption) || 0,
  delta: Number(row.delta) || 0,
  phase: row.phase,
  comments: row.comments,
});

const fromDB = (row) => ({
  id: row.id,
  date: row.date || '',
  start: row.start || '',
  stop: row.stop || '',
  interruption: row.interruption ?? 0,
  delta: row.delta ?? 0,
  phase: row.phase || 'Planning',
  comments: row.comments || '',
  createdBy: row.created_by || null,
});

export const getTimeLogs = (projectName) =>
  api
    .get('/time_logs', { params: { project_name: `eq.${projectName}`, select: '*' } })
    .then((res) => res.data.map(fromDB));

export const createTimeLog = (row, projectName) =>
  api
    .post('/time_logs', toDB(row, projectName), { headers: { Prefer: 'return=representation' } })
    .then((res) => fromDB(res.data[0]));

export const updateTimeLog = (id, row, projectName) =>
  api
    .patch('/time_logs', toDB(row, projectName), {
      params: { id: `eq.${id}` },
      headers: { Prefer: 'return=representation' },
    })
    .then((res) => fromDB(res.data[0]));

export const deleteTimeLog = (id) =>
  api.delete('/time_logs', { params: { id: `eq.${id}` } });
