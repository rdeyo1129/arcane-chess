import { Request, Response, NextFunction } from 'express';
import { Post } from '../models/Post.js';
import { UserI } from '../models/User.js';

export const listPostsByThread = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await Post.find({
      thread: req.params.threadId,
      isHidden: false,
    })
      .populate('author', 'username avatar xp level quote')
      .sort({ createdAt: 1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content, author, parentPost = null } = req.body;
    const post = new Post({
      thread: req.params.threadId,
      parentPost,
      author,
      content,
    });
    const saved = await post.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // soft‐delete
    const deleted = await Post.findByIdAndUpdate(
      req.params.id,
      { isHidden: true },
      { new: true }
    );
    if (!deleted) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post hidden (soft‐deleted)' });
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const user = req.user as UserI;
    const isAuthor = post.author.equals(user._id);
    const isModOrAdmin = ['moderator', 'admin'].includes(user.role);

    if (!isAuthor && !isModOrAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    post.content = req.body.content;
    post.edited = true;
    await post.save();

    res.json(post);
  } catch (err) {
    next(err);
  }
};
