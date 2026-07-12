import { Request, Response, NextFunction } from 'express';
import { AttemptService } from '../services/attempt.service';
import {
  startAttemptSchema,
  submitAttemptSchema,
} from '../validations/attempt.validation';
import { success, created } from '../../../../core/utils/response';
import { ZodError } from 'zod';

const service = new AttemptService();

export class AttemptController {

  async start(req: any, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const validation = startAttemptSchema.parse({
  body: req.body,
});

      const attempt = await service.start(
        validation.body,
        String(req.user.id)
      );

      return created(res, attempt, 'Attempt started');
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: error.issues,
        });
      }

      next(error);
    }
  }

  async submit(req: any, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const validation = submitAttemptSchema.parse({
        body: req.body,
      });

      const score = await service.submit(
        validation.body.attempt_id,
        String(req.user.id)
      );

      return success(res, score, 'Test submitted successfully');
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: error.issues,
        });
      }

      next(error);
    }
  }

  /**
   * GET /candidate/tests
   * Menampilkan semua test yang di-assign ke kandidat
   */
  async getCandidateTests(req: any, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const candidateId = req.user.id; // integer
      const assignments = await service.getCandidateAssignments(candidateId);

      return success(res, assignments, 'Daftar test kandidat');
    } catch (error) {
      next(error);
    }
  }
}