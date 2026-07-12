import { z } from 'zod';

export const answerQuestionSchema = z.object({
  body: z.object({
    attempt_id: z.string().uuid(),
    question_id: z.string().uuid(),
    selected_option_id: z.string().uuid().optional(),
    answer_text: z.string().optional(),
    answer_image: z.string().optional(),
    answer_audio: z.string().optional(),
  }),
});