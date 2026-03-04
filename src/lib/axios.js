import axios from 'axios';
import { supabase } from './supabase';

const supabaseApi = axios.create({
  baseURL: `${import.meta.env.VITE_SUPABASE_URL}/rest/v1`,
  headers: {
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
  },
});

supabaseApi.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY;
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

supabaseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || error.message;
    console.error('[Supabase API Error]', msg);
    return Promise.reject(new Error(msg));
  }
);

export default supabaseApi;
