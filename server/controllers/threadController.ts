import { Request, Response, NextFunction } from 'express';
import { Thread } from '../models/Thread.js';
import { UserI } from '../models/User.js';

export const listThreads = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 20);
    const skip = (page - 1) * limit;

    const filter = {};

    const [totalCount, threads] = await Promise.all([
      Thread.countDocuments(filter),
      Thread.find(filter)
        .populate('author', 'username avatar xp level quote')
        .populate('category', 'name slug')
        .sort({ isPinned: -1, lastActivityAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.json({ threads, page, totalPages, totalCount });
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
