import { Request, Response, NextFunction } from 'express';
import { Thread } from '../models/Thread.js';
import { UserI } from '../models/User.js';

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
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
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
    const thread = new Thread({
      title,
      content,
      author,
      category,
      tags,
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
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ message: 'Thread not found' });

    const user = req.user as UserI;
    const isAuthor = thread.author.equals(user._id);
    const isModOrAdmin = ['moderator', 'admin'].includes(user.role);

    if (!isAuthor && !isModOrAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Apply allowed updates
    if (req.body.title) thread.title = req.body.title;
    if (req.body.content) thread.content = req.body.content;
    if (req.body.tags) thread.tags = req.body.tags;

    await thread.save();
    res.json(thread);
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
    const deleted = await Thread.findByIdAndUpdate(
      req.params.id,
      { isHidden: true },
      { new: true }
    );
    if (!deleted) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    res.json({ message: 'Thread hidden (soft-deleted)' });
  } catch (err) {
    next(err);
  }
};
