import { Request, Response, NextFunction } from 'express';
import { paginationQuerySchema } from '../validation/querySchemas.js';
import { treeifyError } from 'zod';

export default function validateQuery(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = paginationQuerySchema.safeParse(req.query);
  if (!result.success) {
    // Build a nested error tree
    const errors = treeifyError(result.error);
    return res.status(400).json({ errors });
  }

  // Overwrite req.query with the parsed (number) values
  req.query = {
    ...req.query,
    page: result.data.page,
    limit: result.data.limit,
  } as any;

  next();
}
