import { createContext, useContext, useState } from 'react';
import { api, setAccessToken } from './axios';


const AuthCtx = createContext(null);
export function AuthProvider({ children }) {
const [user, setUser] = useState(null);


async function login(email, password) {
const { data } = await api.post('/api/auth/login', { email, password });
setAccessToken(data.access);
setUser(data.user);
}


async function logout() {
await api.post('/api/auth/logout');
setAccessToken(null);
setUser(null);
}


return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}
export function useAuth() { return useContext(AuthCtx); }