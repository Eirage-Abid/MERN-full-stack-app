import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

function setRefreshCookie(res, token) {
  const opts = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/api/auth'
  };
  if (process.env.COOKIE_DOMAIN) opts.domain = process.env.COOKIE_DOMAIN;
  res.cookie('refresh', token, { ...opts, maxAge: 7 * 24 * 60 * 60 * 1000 });
}


function clearRefreshCookie(res) {
const opts = { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/api/auth' };
if (process.env.COOKIE_DOMAIN) opts.domain = process.env.COOKIE_DOMAIN;
res.clearCookie('refresh', opts);
}


router.post('/signup', async (req, res) => {
const { name, email, password } = req.body || {};
if (!name || !email || !password) return res.status(400).json({ message: 'name, email, password required' });
const exists = await User.findOne({ email });
if (exists) return res.status(409).json({ message: 'Email already in use' });
const hash = await bcrypt.hash(password, 12);
const user = await User.create({ name, email, password: hash, role: 'user' });
const access = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_TTL || '10m' });
const refresh = jwt.sign({ sub: user.id, ver: user.tokenVersion }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_TTL || '7d' });
setRefreshCookie(res, refresh);
res.status(201).json({ access, user: { id: user.id, name: user.name, role: user.role } });
});


router.post('/login', async (req, res) => {
const { email, password } = req.body || {};
if (!email || !password) return res.status(400).json({ message: 'email and password required' });
const user = await User.findOne({ email }).select('+password');
if (!user) return res.status(401).json({ message: 'Invalid credentials' });
const ok = await bcrypt.compare(password, user.password);
if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
const access = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_TTL || '10m' });
const refresh = jwt.sign({ sub: user.id, ver: user.tokenVersion }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_TTL || '7d' });
setRefreshCookie(res, refresh);
res.json({ access, user: { id: user.id, name: user.name, role: user.role } });
});


router.post('/logout', async (_req, res) => {
clearRefreshCookie(res);
res.status(204).end();
});


router.post('/refresh', async (req, res) => {
const token = req.cookies?.refresh;
if (!token) return res.status(401).json({ message: 'Missing refresh token' });
try {
const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
const user = await User.findById(payload.sub);
if (!user || user.tokenVersion !== payload.ver) return res.status(401).json({ message: 'Invalid refresh token' });
// rotate
user.tokenVersion += 1;
await user.save();
const access = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_TTL || '10m' });
const refresh = jwt.sign({ sub: user.id, ver: user.tokenVersion }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_TTL || '7d' });
setRefreshCookie(res, refresh);
res.json({ access });
} catch (e) {
return res.status(401).json({ message: 'Invalid refresh token' });
}
});


export default router;