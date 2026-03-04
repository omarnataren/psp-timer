import { useState, useEffect, useCallback } from 'react';
import { getMyProfile, upsertProfile } from '../api/profilesApi';

export function useProfile(user) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    getMyProfile(user.id)
      .then((p) => { setProfile(p); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user?.id]);

  const updateProfile = useCallback(async (fullName) => {
    const updated = await upsertProfile(user.id, fullName);
    setProfile(updated);
    return updated;
  }, [user?.id]);

  return { profile, loading, updateProfile };
}
