import api from '../lib/axios';

export const getMyProfile = (userId) =>
  api
    .get('/profiles', { params: { id: `eq.${userId}`, select: '*' } })
    .then((res) => res.data[0] || null);

export const upsertProfile = (id, fullName) =>
  api
    .post('/profiles', { id, full_name: fullName }, {
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    })
    .then((res) => res.data[0]);

export const getProfilesByIds = (ids) => {
  if (!ids?.length) return Promise.resolve([]);
  return api
    .get('/profiles', { params: { id: `in.(${ids.join(',')})`, select: 'id,full_name' } })
    .then((res) => res.data);
};
