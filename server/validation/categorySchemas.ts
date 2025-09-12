import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  order: z.number().optional(),
  parent: z.string().length(24).nullable().optional(),
  icon: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  isHidden: z.boolean().optional(),
});
