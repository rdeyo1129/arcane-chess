import { Request, Response, NextFunction } from 'express';
import slugify from 'slugify';
import { Thread } from '../models/Thread.js';

export const listThreads = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const threads = await Thread.find({ isHidden: false })
      .populate('author', 'username avatar xp level quote')
      .populate('category', 'name slug')
      .sort({ isPinned: -1, lastActivityAt: -1 });
    res.json(threads);
  } catch (err) {
    next(err);
  }
};

export const getThreadById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const thread = await Thread.findOne({ _id: req.params.id, isHidden: false })
      .populate('author', 'username avatar xp level quote')
      .populate('category', 'name slug');
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    // Optionally increment view count:
    thread.views++;
    await thread.save();
    res.json(thread);
  } catch (err) {
    next(err);
  }
};

export const createThread = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, author, category, tags = [] } = req.body;
    const slug = slugify(title, { lower: true, strict: true });
    const thread = new Thread({
      title,
      content,
      author,
      category,
      tags,
      slug,
    });
    const saved = await thread.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

export const updateThread = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updates: any = { ...req.body };
    // If title changed, regenerate slug
    if (updates.title) {
      updates.slug = slugify(updates.title, { lower: true, strict: true });
    }
    const updated = await Thread.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: 'Thread not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteThread = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // soft‐delete
    const deleted = await Thread.findByIdAndUpdate(
      req.params.id,
      { isHidden: true },
      { new: true }
    );
    if (!deleted) return res.status(404).json({ message: 'Thread not found' });
    res.json({ message: 'Thread hidden (soft‐deleted)' });
  } catch (err) {
    next(err);
  }
};
