import jwt from 'jsonwebtoken';


export function verifyAccess(req, res, next) {
const auth = req.headers.authorization;
const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
if (!token) return res.status(401).json({ message: 'Missing access token' });
try {
const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
req.user = payload; // { sub, role }
next();
} catch {
return res.status(401).json({ message: 'Invalid or expired token' });
}
}


export function requireRole(...roles) {
return (req, res, next) => {
const role = req.user?.role;
if (!role || !roles.includes(role)) return res.status(403).json({ message: 'Forbidden' });
next();
};
}