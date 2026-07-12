import { z } from 'zod';

export const createTestSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().optional(),
    duration_minutes: z.number().int().positive('Duration must be positive'),
    is_active: z.boolean().optional().default(true),
  }),
});

export const updateTestSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid test ID'),
  }),
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    duration_minutes: z.number().int().positive().optional(),
    is_active: z.boolean().optional(),
  }),
});