import { z } from 'zod';

export const createPostSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  parentPost: z.string().length(24).optional(),
});

export const updatePostSchema = z.object({
  content: z.string().min(1, "Content can't be empty"),
});
