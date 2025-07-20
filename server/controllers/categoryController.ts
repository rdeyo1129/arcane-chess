import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category.js';

export const listCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cats = await Category.find({ isHidden: false }).sort('order');
    res.json(cats);
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cat = await Category.findOne({
      _id: req.params.id,
      isHidden: false,
    });
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    res.json(cat);
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      slug, // now expect slug from req.body
      description = '',
      order = 0,
      parent = null,
      icon = '',
    } = req.body;

    const cat = new Category({
      name,
      slug,
      description,
      order,
      parent,
      icon,
    });

    const saved = await cat.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updates: Partial<{
      name: string;
      slug: string;
      description: string;
      order: number;
      parent: string | null;
      icon: string;
      isHidden: boolean;
    }> = { ...req.body };

    const updated = await Category.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: 'Category not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // soft-delete
    const deleted = await Category.findByIdAndUpdate(
      req.params.id,
      { isHidden: true },
      { new: true }
    );
    if (!deleted)
      return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category hidden (soft-deleted)' });
  } catch (err) {
    next(err);
  }
};
