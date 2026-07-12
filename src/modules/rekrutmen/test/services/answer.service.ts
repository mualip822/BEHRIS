import { AnswerRepository } from '../repositories/answer.repository';
import { AnswerQuestionDTO, TestAnswer } from '../types';
import {
  NotFoundError,
  ForbiddenError,
} from '../../../../core/middlewares/error.middleware';
import { AttemptRepository } from '../repositories/attempt.repository';

const answerRepo = new AnswerRepository();
const attemptRepo = new AttemptRepository();

export class AnswerService {
  async saveAnswer(
    dto: AnswerQuestionDTO,
    candidateId: string,
    filePaths?: {
      answer_image?: string;
      answer_audio?: string;
    }
  ): Promise<TestAnswer> {

    const attempt = await attemptRepo.findById(dto.attempt_id);

    // =======================
    // DEBUG LOG
    // =======================
    console.log('\n========== SAVE ANSWER ==========');
    console.log('USER LOGIN ID      :', candidateId);
    console.log('ATTEMPT            :', attempt);
    console.log('ATTEMPT ID         :', dto.attempt_id);
    console.log('QUESTION ID        :', dto.question_id);
    console.log('ATTEMPT CANDIDATE  :', attempt?.candidate_id);
    console.log('ATTEMPT STATUS     :', attempt?.status);
    console.log('DTO                :', dto);
    console.log('=================================\n');

    if (!attempt) {
      throw new NotFoundError('Attempt not found');
    }

    if (String(attempt.candidate_id) !== String(candidateId)) {
      throw new ForbiddenError('Forbidden');
    }

    if (attempt.status !== 'in_progress') {
      throw new ForbiddenError('Attempt is not active');
    }

    const data = {
      ...dto,
    };

    if (filePaths?.answer_image) {
      data.answer_image = filePaths.answer_image;
    }

    if (filePaths?.answer_audio) {
      data.answer_audio = filePaths.answer_audio;
    }

    return answerRepo.createOrUpdate(data);
  }
}