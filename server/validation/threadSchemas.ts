import { z } from 'zod';

// Schema for creating a thread
export const createThreadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().length(24, 'Invalid category ID'),
  tags: z.array(z.string()).optional(),
  // Optional control flags on creation:
  isLocked: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  status: z.enum(['open', 'closed', 'archived']).optional(),
});

// Schema for updating a thread
export const updateThreadSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  category: z.string().length(24).optional(),
  tags: z.array(z.string()).optional(),
  isLocked: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  status: z.enum(['open', 'closed', 'archived']).optional(),
});
