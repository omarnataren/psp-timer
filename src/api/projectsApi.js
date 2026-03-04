import api from '../lib/axios';

export const getAllProjects = () =>
  api
    .get('/projects', {
      params: { select: 'name,team_id,created_at,teams(id,name)', order: 'created_at.asc' },
    })
    .then((res) =>
      res.data.map((p) => ({
        name: p.name,
        teamId: p.team_id,
        teamName: p.teams?.name || 'Sin equipo',
        createdAt: p.created_at,
      }))
    );

export const createProject = (name, teamId) =>
  api
    .post('/projects', { name, team_id: teamId }, { headers: { Prefer: 'return=representation' } })
    .then((res) => res.data[0]);
