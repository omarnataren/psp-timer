import api from '../lib/axios';

// ─── Teams ────────────────────────────────────────────────────────────────────

export const getMyTeams = (userId) =>
  api
    .get('/team_members', {
      params: { user_id: `eq.${userId}`, select: 'teams(id,name,invite_code,owner_id,created_at)' },
    })
    .then((res) => res.data.map((r) => ({
      id: r.teams.id,
      name: r.teams.name,
      inviteCode: r.teams.invite_code,
      ownerId: r.teams.owner_id,
      createdAt: r.teams.created_at,
    })));

export const createTeam = async (name) => {
  const res = await api.post('/rpc/create_team', { team_name: name });
  const t = res.data;
  return { id: t.id, name: t.name, inviteCode: t.invite_code, ownerId: t.owner_id };
};

export const joinTeamByCode = async (code) => {
  const res = await api.post('/rpc/join_team', { invite_code_input: code.trim().toUpperCase() });
  return res.data;
};

// ─── Team detail ─────────────────────────────────────────────────────────────

export const getTeamMembers = (teamId) =>
  api
    .get('/team_members', {
      params: { team_id: `eq.${teamId}`, select: 'user_id,profiles(id,full_name)' },
    })
    .then((res) =>
      res.data.map((r) => ({
        userId: r.user_id,
        fullName: r.profiles?.full_name || 'Sin nombre',
      }))
    );

export const getTeamProjects = (teamId) =>
  api
    .get('/projects', { params: { team_id: `eq.${teamId}`, select: '*', order: 'created_at.asc' } })
    .then((res) => res.data);
