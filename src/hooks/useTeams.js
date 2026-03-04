import { useState, useEffect, useCallback } from 'react';
import {
  getMyTeams,
  createTeam as apiCreateTeam,
  joinTeamByCode as apiJoin,
  getTeamMembers,
  getTeamProjects,
} from '../api/teamsApi';

export function useTeams(user) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeams = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getMyTeams(user.id);
      setTeams(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchTeams(); }, [fetchTeams]);

  const createTeam = useCallback(async (name) => {
    const team = await apiCreateTeam(name);
    await fetchTeams();
    return team;
  }, [fetchTeams]);

  const joinTeam = useCallback(async (code) => {
    const team = await apiJoin(code);
    await fetchTeams();
    return team;
  }, [fetchTeams]);

  return { teams, loading, error, createTeam, joinTeam, refetch: fetchTeams };
}

export function useTeamDetail(teamId) {
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!teamId) return;
    setLoading(true);
    Promise.all([getTeamMembers(teamId), getTeamProjects(teamId)])
      .then(([m, p]) => { setMembers(m); setProjects(p); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [teamId]);

  // profiles map: { [userId]: fullName }
  const profilesMap = Object.fromEntries(members.map((m) => [m.userId, m.fullName]));

  return { members, projects, loading, profilesMap };
}
