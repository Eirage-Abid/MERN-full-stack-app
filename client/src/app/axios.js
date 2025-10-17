import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE, withCredentials: true });
let accessToken = null;
export const setAccessToken = (t) => (accessToken = t);
api.interceptors.request.use((config) => {
if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
return config;
});