import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';

import {
  createThreadSchema,
  updateThreadSchema,
} from '../validation/threadSchemas.js';

const schemas: Record<string, ZodType> = {
  createThread: createThreadSchema,
  updateThread: updateThreadSchema,
};

export default function validate(schemaKey: keyof typeof schemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    const schema = schemas[schemaKey];
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ errors: err.flatten().fieldErrors });
      }
      next(err);
    }
  };
}
