import { Router, Request, Response } from 'express';
import { Thread } from '../models/Thread.js';

const router = Router();

// GET /api/threads
router.get('/', async (req: Request, res: Response) => {
  try {
    const threads = await Thread.find()
      .populate('author', 'username')
      .populate('category', 'name');
    res.json(threads);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/threads/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const thread = await Thread.findById(req.params.id)
      .populate('author', 'username')
      .populate('category', 'name');
    if (!thread) return res.status(404).json({ message: 'Not found' });
    res.json(thread);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/threads
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, content, author, category, tags } = req.body;
    const newThread = new Thread({ title, content, author, category, tags });
    const saved = await newThread.save();
    res.status(201).json(saved);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/threads/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await Thread.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/threads/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await Thread.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
