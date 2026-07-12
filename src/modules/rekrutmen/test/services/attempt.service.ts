import { AttemptRepository } from '../repositories/attempt.repository';
import { TestRepository } from '../repositories/test.repository';
import { ScoringService } from './scoring.service';

import {
  StartAttemptDTO,
  TestAttempt,
  TestScore,
  AssignmentStatus,
} from '../types';

import {
  NotFoundError,
  ValidationError,
} from '../../../../core/middlewares/error.middleware';

import pool from '../../../../config/db';

const attemptRepo = new AttemptRepository();
const testRepo = new TestRepository();
const scoringService = new ScoringService();

export class AttemptService {

  async start(
    dto: StartAttemptDTO,
    candidateId: string
  ): Promise<TestAttempt> {

    // ===========================
    // VALIDASI TEST
    // ===========================

    const test = await testRepo.findById(dto.test_id);

    if (!test) {
      throw new NotFoundError('Test tidak ditemukan');
    }

    if (!test.is_active) {
      throw new ValidationError('Test tidak aktif');
    }

    // ===========================
    // CEK ASSIGNMENT
    // ===========================

    const assignment =
      await attemptRepo.findAssignmentByCandidateAndTest(
        candidateId,
        dto.test_id
      );

    console.log('ASSIGNMENT:', assignment);

    if (!assignment) {
      throw new ValidationError(
        'Anda tidak memiliki akses ke test ini'
      );
    }

    // ===========================
    // SUDAH SELESAI
    // ===========================

    if (
      assignment.status ===
      AssignmentStatus.COMPLETED
    ) {
      throw new ValidationError(
        'Test sudah selesai'
      );
    }

    // ===========================
    // SUDAH ADA ATTEMPT
    // ===========================

    const activeAttempt =
      await attemptRepo.getActiveAttempt(
        candidateId,
        dto.test_id
      );

    if (activeAttempt) {
      return activeAttempt;
    }

    // ===========================
    // BUAT ATTEMPT BARU
    // ===========================

    const attempt =
      await attemptRepo.start(
        dto,
        candidateId
      );

    // ===========================
    // UPDATE STATUS ASSIGNMENT
    // ===========================

    if (
      assignment.status ===
      AssignmentStatus.ASSIGNED
    ) {
      await attemptRepo.updateAssignmentStatus(
        assignment.id,
        AssignmentStatus.IN_PROGRESS
      );
    }

    return attempt;
  }

  async submit(
    attemptId: string,
    candidateId: string
  ): Promise<TestScore> {

    const attempt =
      await attemptRepo.findById(
        attemptId
      );

    if (!attempt) {
      throw new NotFoundError(
        'Attempt tidak ditemukan'
      );
    }

    if (
      attempt.candidate_id !== candidateId
    ) {
      throw new ValidationError(
        'Attempt bukan milik anda'
      );
    }

    if (
      attempt.status !== 'in_progress'
    ) {
      throw new ValidationError(
        'Attempt sudah selesai'
      );
    }

    const client =
      await pool.connect();

    try {

      await client.query('BEGIN');

      await client.query(
        `
        UPDATE test_attempts
        SET
          status='completed',
          finished_at=NOW()
        WHERE id=$1
        `,
        [attemptId]
      );

      const score =
        await scoringService.calculateAndSaveScores(
          attemptId,
          client
        );

      const assignment =
        await attemptRepo.findAssignmentByCandidateAndTest(
          candidateId,
          attempt.test_id
        );

      if (assignment) {
        await attemptRepo.updateAssignmentStatus(
          assignment.id,
          AssignmentStatus.COMPLETED
        );
      }

      await client.query('COMMIT');

      return score;

    } catch (err) {

      await client.query('ROLLBACK');
      throw err;

    } finally {

      client.release();

    }
  }

  async getCandidateAssignments(
    candidateId: string
  ) {
    return attemptRepo.getAssignmentsByCandidate(
      candidateId
    );
  }

}