import { Request, Response, NextFunction } from 'express';
import { CandidateTestService } from '../services/candidateTest.service';
import { success } from '../../../../core/utils/response';

const service = new CandidateTestService();

export class CandidateTestController {
  async getAssignments(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id; // integer
      const data = await service.getAssignments(userId);
      return success(res, data, 'Daftar test kandidat');
    } catch (error) {
      next(error);
    }
  }

  async getTestById(req: any, res: Response, next: NextFunction) {
    try {
      const testId = req.params.testId;
      const userId = req.user.id;
      const test = await service.getTestById(testId, userId);
      return success(res, test, 'Detail test');
    } catch (error) {
      next(error);
    }
  }

  async getQuestionsByTestId(req: any, res: Response, next: NextFunction) {
    try {
      const testId = req.params.testId;
      const userId = req.user.id;
      const questions = await service.getQuestionsByTestId(testId, userId);
      return success(res, questions, 'Daftar soal');
    } catch (error) {
      next(error);
    }
  }

  async getAssignmentByMessage(req: any, res: Response, next: NextFunction) {
    try {
      const messageId = req.params.messageId;
      const userId = req.user.id;
      const data = await service.getAssignmentByMessage(messageId, userId);
      return success(res, data, 'Test assignment');
    } catch (error) {
      next(error);
    }
  }

  async getAttemptById(req: any, res: Response, next: NextFunction) {
    try {
      const attemptId = req.params.attemptId;
      const userId = req.user.id;
      const attempt = await service.getAttemptById(attemptId, userId);
      return success(res, attempt, 'Detail attempt');
    } catch (error) {
      next(error);
    }
  }

  async getAttemptQuestions(req: any, res: Response, next: NextFunction) {
    try {
      const attemptId = req.params.attemptId;
      const userId = req.user.id;
      const questions = await service.getAttemptQuestions(attemptId, userId);
      return success(res, questions, 'Soal attempt');
    } catch (error) {
      next(error);
    }
  }

  async getAttemptScore(req: any, res: Response, next: NextFunction) {
    try {
      const attemptId = req.params.attemptId;
      const userId = req.user.id;
      const score = await service.getAttemptScore(attemptId, userId);
      return success(res, score, 'Skor attempt');
    } catch (error) {
      next(error);
    }
  }
}