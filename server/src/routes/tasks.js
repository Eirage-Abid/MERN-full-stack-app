import { Router } from 'express';
import Task from '../models/Task.js';
import { requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(req.query.pageSize) || 10, 1), 100);
  const q = (req.query.q || '').toString().trim();
  const sort = ['createdAt', 'title'].includes(req.query.sort) ? req.query.sort : 'createdAt';
  const order = req.query.order === 'asc' ? 1 : -1;

  const filter = { owner: req.user.sub };
  if (q) filter.title = { $regex: q, $options: 'i' };

  const total = await Task.countDocuments(filter);
  const items = await Task.find(filter)
    .sort({ [sort]: order })
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  res.json({ items, page, pageSize, total });
});


router.post('/', async (req, res) => {
const { title, description, status } = req.body || {};
if (!title) return res.status(400).json({ message: 'title required' });
const task = await Task.create({ title, description, status: status || 'todo', owner: req.user.sub });
res.status(201).json(task);
});


router.get('/:id', async (req, res) => {
const task = await Task.findOne({ _id: req.params.id, owner: req.user.sub });
if (!task) return res.status(404).json({ message: 'Not found' });
res.json(task);
});


router.put('/:id', async (req, res) => {
const { title, description, status } = req.body || {};
const update = {};
if (title !== undefined) update.title = title;
if (description !== undefined) update.description = description;
if (status !== undefined) update.status = status;
const task = await Task.findOneAndUpdate({ _id: req.params.id, owner: req.user.sub }, update, { new: true });
if (!task) return res.status(404).json({ message: 'Not found' });
res.json(task);
});


router.delete('/:id', async (req, res) => {
const deleted = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.sub });
if (!deleted) return res.status(404).json({ message: 'Not found' });
res.status(204).end();
});


// Manager/Admin view (awareness)
router.get('/admin/all', requireRole('manager', 'admin'), async (_req, res) => {
const items = await Task.find().limit(200).sort({ createdAt: -1 });
res.json({ items });
});


export default router;