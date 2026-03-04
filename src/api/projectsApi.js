import api from '../lib/axios';

export const getProjects = () =>
  api
    .get('/projects', { params: { select: 'name', order: 'created_at.asc' } })
    .then((res) => res.data.map((p) => p.name));

export const createProject = (name) =>
  api
    .post('/projects', { name }, { headers: { Prefer: 'return=representation' } })
    .then((res) => res.data[0].name);
