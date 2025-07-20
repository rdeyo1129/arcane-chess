import { z } from 'zod';

export const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((n) => Number.isInteger(n) && n > 0, {
      message: 'page must be a positive integer',
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .refine((n) => Number.isInteger(n) && n > 0, {
      message: 'limit must be a positive integer',
    }),
});
