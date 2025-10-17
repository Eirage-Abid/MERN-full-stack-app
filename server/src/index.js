import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import { rateLimiter } from './middleware/rateLimit.js';
import { errorHandler, notFound } from './middleware/error.js';


const app = express();


// CORS — allow Vite dev origin
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));


app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter);


app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);


app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskforge';


mongoose.connect(MONGO_URI).then(() => {
console.log('MongoDB connected');
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
}).catch(err => {
console.error('Mongo connection error:', err);
process.exit(1);
});