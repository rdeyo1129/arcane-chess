import { Router, Request, Response } from 'express';
import { Category } from '../models/Category.js';

const router = Router();

// GET /api/categories
router.get('/', async (_req: Request, res: Response) => {
  try {
    const cats = await Category.find().sort('order');
    res.json(cats);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/categories/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Not found' });
    res.json(cat);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/categories
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, order } = req.body;
    const newCat = new Category({ name, description, order });
    const saved = await newCat.save();
    res.status(201).json(saved);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/categories/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
