import api from '../lib/axios';

const toDB = (row, projectName) => ({
  project_name: projectName,
  date: row.date,
  type: Number(row.type) || 10,
  injected: row.injected,
  removed: row.removed,
  fix_time: Number(row.fixTime) || 0,
  description: row.description,
});

const fromDB = (row) => ({
  id: row.id,
  date: row.date || '',
  type: row.type ?? 10,
  injected: row.injected || 'Planning',
  removed: row.removed || 'Planning',
  fixTime: row.fix_time ?? 0,
  description: row.description || '',
});

export const getDefectLogs = (projectName) =>
  api
    .get('/defect_logs', { params: { project_name: `eq.${projectName}`, select: '*' } })
    .then((res) => res.data.map(fromDB));

export const createDefectLog = (row, projectName) =>
  api
    .post('/defect_logs', toDB(row, projectName), { headers: { Prefer: 'return=representation' } })
    .then((res) => fromDB(res.data[0]));

export const updateDefectLog = (id, row, projectName) =>
  api
    .patch('/defect_logs', toDB(row, projectName), {
      params: { id: `eq.${id}` },
      headers: { Prefer: 'return=representation' },
    })
    .then((res) => fromDB(res.data[0]));

export const deleteDefectLog = (id) =>
  api.delete('/defect_logs', { params: { id: `eq.${id}` } });
