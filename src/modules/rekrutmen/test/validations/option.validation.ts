import { z } from 'zod';

export const createOptionSchema = z.object({
  body: z.object({
    question_id: z.string().uuid(),
    option_text: z.string().optional(),
    option_image: z.string().optional(),
    is_correct: z.boolean(),
  }),
});

export const updateOptionSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    option_text: z.string().optional(),
    option_image: z.string().optional(),
    is_correct: z.boolean().optional(),
  }),
});