import { Router, Request, Response } from 'express';
import { Post } from '../models/Post.js';

const router = Router();

// GET /api/posts/:threadId
router.get('/:threadId', async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({ thread: req.params.threadId })
      .populate('author', 'username')
      .sort('createdAt');
    res.json(posts);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/posts/:threadId
router.post('/:threadId', async (req: Request, res: Response) => {
  try {
    const { content, author, parentPost } = req.body;
    const newPost = new Post({
      thread: req.params.threadId,
      content,
      author,
      parentPost: parentPost || null,
    });
    const saved = await newPost.save();
    res.status(201).json(saved);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
