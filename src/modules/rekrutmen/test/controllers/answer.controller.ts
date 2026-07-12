import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

import { AnswerService } from '../services/answer.service';
import { answerQuestionSchema } from '../validations/answer.validation';
import { success } from '../../../../core/utils/response';
import {
  uploadAnswerImage,
  uploadAnswerAudio,
} from '../config/multer.config';

const service = new AnswerService();

export class AnswerController {
  // =========================
  // TEXT / IMAGE ANSWER
  // =========================
  async save(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    uploadAnswerImage(req, res, async (err) => {
      if (err) return next(err);

      try {
        const user = (req as any).user;

        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Unauthorized',
          });
        }

        const validation = answerQuestionSchema.parse({
          body: req.body,
        });

        const answer = await service.saveAnswer(
          validation.body,
          user.id,
          {
            answer_image: (req as any).file?.path,
          }
        );

        return success(
          res,
          answer,
          'Answer saved'
        );
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: error.issues,
          });
        }

        next(error);
      }
    });
  }

  // =========================
  // AUDIO ANSWER
  // =========================
  async saveAudio(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    uploadAnswerAudio(req, res, async (err) => {
      if (err) return next(err);

      try {
        const user = (req as any).user;

        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Unauthorized',
          });
        }

        const { attempt_id, question_id } = req.body;

        if (!attempt_id || !question_id) {
          return res.status(400).json({
            success: false,
            message: 'attempt_id and question_id required',
          });
        }

        const answer = await service.saveAnswer(
          {
            attempt_id: String(attempt_id),
            question_id: String(question_id),
          },
          user.id,
          {
            answer_audio: (req as any).file?.path,
          }
        );

        return success(
          res,
          answer,
          'Audio answer saved'
        );
      } catch (error) {
        next(error);
      }
    });
  }
}