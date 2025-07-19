import { Request, Response, NextFunction } from 'express';
import slugify from 'slugify';
import { Category } from '../models/Category';

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
      description = '',
      order = 0,
      parent = null,
      icon = '',
    } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const cat = new Category({
      name,
      description,
      order,
      parent,
      icon,
      slug,
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
    const updates: any = { ...req.body };
    if (updates.name) {
      updates.slug = slugify(updates.name, { lower: true, strict: true });
    }
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
    // soft‐delete
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
