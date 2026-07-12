import { z } from 'zod';

export const startAttemptSchema = z.object({
  body: z.object({
    test_id: z.string().uuid('Invalid test ID'),
  }),
});

export const submitAttemptSchema = z.object({
  body: z.object({
    attempt_id: z.string().uuid('Invalid attempt ID'),
  }),
});