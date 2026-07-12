import { TestRepository } from '../repositories/test.repository';
import { AttemptRepository } from '../repositories/attempt.repository';
import { QuestionRepository } from '../repositories/question.repository';
import { OptionRepository } from '../repositories/option.repository';
import { TestScoreRepository } from '../repositories/testScore.repository';

import {
  NotFoundError,
  ValidationError
} from '../../../../core/middlewares/error.middleware';

import {
  Test,
  Question,
  TestScore
} from '../types';

const testRepo = new TestRepository();
const attemptRepo = new AttemptRepository();
const questionRepo = new QuestionRepository();
const optionRepo = new OptionRepository();
const testScoreRepo = new TestScoreRepository();

export class CandidateTestService {

  async getAssignments(candidateId: string) {
    return attemptRepo.getAssignmentsByCandidate(
      candidateId
    );
  }

  async getTestById(
    testId: string,
    candidateId: string
  ): Promise<Test> {

    const assignment =
      await attemptRepo.findAssignmentByCandidateAndTest(
        candidateId,
        testId
      );

    if (!assignment) {
      throw new ValidationError(
        'Anda tidak memiliki akses ke test ini'
      );
    }

    const test =
      await testRepo.findById(testId);

    if (!test) {
      throw new NotFoundError(
        'Test not found'
      );
    }

    return test;
  }

  async getQuestionsByTestId(
    testId: string,
    candidateId: string
  ): Promise<Question[]> {

    await this.getTestById(
      testId,
      candidateId
    );

    const questions =
      await questionRepo.findByTestId(
        testId
      );

    const result = [];

    for (const q of questions) {

      const options =
        await optionRepo.findByQuestionId(
          q.id
        );

      result.push({
        ...q,
        options
      });
    }

    return result;
  }

  /**
   * TIDAK ADA message_id DI candidate_tests
   * Ambil assignment kandidat terbaru
   */
  async getAssignmentByMessage(
    _messageId: string,
    candidateId: string
  ) {

    const assignments =
      await attemptRepo.getAssignmentsByCandidate(
        candidateId
      );

    if (!assignments.length) {
      throw new NotFoundError(
        'Tidak ada test assignment'
      );
    }

    const assignment =
      assignments[0];

    const test =
      await testRepo.findById(
        assignment.test_id
      );

    if (!test) {
      throw new NotFoundError(
        'Test not found'
      );
    }

    return {
      assignment,
      test
    };
  }

  async getAttemptById(
    attemptId: string,
    candidateId: string
  ) {

    const attempt =
      await attemptRepo.getByIdWithTest(
        attemptId
      );

    if (!attempt) {
      throw new NotFoundError(
        'Attempt not found'
      );
    }

    if (
      attempt.candidate_id !==
      candidateId
    ) {
      throw new ValidationError(
        'Forbidden'
      );
    }

    return attempt;
  }

  async getAttemptQuestions(
    attemptId: string,
    candidateId: string
  ) {

    const attempt =
      await this.getAttemptById(
        attemptId,
        candidateId
      );

    return this.getQuestionsByTestId(
      attempt.test_id,
      candidateId
    );
  }

  async getAttemptScore(
    attemptId: string,
    candidateId: string
  ): Promise<TestScore> {

    await this.getAttemptById(
      attemptId,
      candidateId
    );

    const score =
      await testScoreRepo.findByAttemptId(
        attemptId
      );

    if (!score) {
      throw new NotFoundError(
        'Score not found'
      );
    }

    return score;
  }
}