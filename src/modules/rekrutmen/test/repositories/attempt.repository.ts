import pool from '../../../../config/db';
import {
  TestAttempt,
  StartAttemptDTO,
  AttemptStatus,
  CandidateTestAssignment,
  AssignmentStatus,
  AttemptWithTest,
  TestScore
} from '../types';

export class AttemptRepository {
  async start(dto: StartAttemptDTO, candidateId: string): Promise<TestAttempt> {
  const existing = await pool.query(
    `SELECT *
     FROM test_attempts
     WHERE candidate_id = $1
     AND test_id = $2
     AND status = 'in_progress'`,
    [candidateId, dto.test_id]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  const res = await pool.query(
    `INSERT INTO test_attempts
     (candidate_id, test_id, status)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [candidateId, dto.test_id, AttemptStatus.IN_PROGRESS]
  );

  return res.rows[0];
}

  async findById(id: string): Promise<TestAttempt | null> {
    const res = await pool.query('SELECT * FROM test_attempts WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async submit(attemptId: string): Promise<TestAttempt> {
    const res = await pool.query(
      `UPDATE test_attempts SET status = 'completed', finished_at = now() WHERE id = $1 RETURNING *`,
      [attemptId]
    );
    return res.rows[0] || null;
  }

  async getActiveAttempt(candidateId: string, testId: string): Promise<TestAttempt | null> {
    const res = await pool.query(
      `SELECT * FROM test_attempts WHERE candidate_id = $1 AND test_id = $2 AND status = 'in_progress'`,
      [candidateId, testId]
    );
    return res.rows[0] || null;
  }

  // =========== ASSIGNMENT METHODS ===========

  async findAssignmentByCandidateAndTest(
  candidateId: string,
  testId: string
): Promise<CandidateTestAssignment | null> {

  const res = await pool.query(
    `
    SELECT *
    FROM candidate_tests
    WHERE candidate_id = $1
      AND test_id = $2
    ORDER BY assigned_at DESC
    LIMIT 1
    `,
    [candidateId, testId]
  );

  console.log("QUERY ASSIGNMENT:", res.rows);

  return res.rows[0] || null;
}

  async updateAssignmentStatus(assignmentId: string, status: AssignmentStatus): Promise<void> {
    await pool.query(
      `UPDATE candidate_tests SET status = $1 WHERE id = $2`,
      [status, assignmentId]
    );
  }

  async getAssignmentsByCandidate(candidateId: string): Promise<CandidateTestAssignment[]> {
    const res = await pool.query(
      `SELECT a.*, t.title AS test_title, t.description AS test_description
       FROM candidate_tests a
       JOIN tests t ON t.id = a.test_id
       WHERE a.candidate_id = $1
       ORDER BY a.assigned_at DESC`,
      [candidateId]
    );
    return res.rows;
  }
  async getByIdWithTest(attemptId: string): Promise<AttemptWithTest | null> {
  const res = await pool.query(
    `SELECT ta.*, t.title as test_title, t.description as test_description, t.duration_minutes
     FROM test_attempts ta
     JOIN tests t ON t.id = ta.test_id
     WHERE ta.id = $1`,
    [attemptId]
  );
  return res.rows[0] || null;
}

async getScore(attemptId: string): Promise<TestScore | null> {
  const res = await pool.query(
    'SELECT * FROM test_scores WHERE attempt_id = $1',
    [attemptId]
  );
  return res.rows[0] || null;
}
async findAssignmentByMessageIdAndCandidate(
  messageId: string,
  candidateId: string
) {
  const res = await pool.query(
    `
    SELECT *
    FROM candidate_tests
    WHERE message_id = $1
    AND candidate_id = $2
    `,
    [messageId, candidateId]
  );

  return res.rows[0] || null;
}
}