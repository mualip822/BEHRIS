import pool from '../../../../config/db';
import { TestScore } from '../types';

export class TestScoreRepository {
  async findByAttemptId(attemptId: string): Promise<TestScore | null> {
    const res = await pool.query(
      'SELECT * FROM test_scores WHERE attempt_id = $1',
      [attemptId]
    );
    return res.rows[0] || null;
  }

  async create(score: Omit<TestScore, 'id' | 'created_at'>): Promise<TestScore> {
    const { attempt_id, multiple_choice_score, essay_score, audio_score, total_score, passed } = score;
    const res = await pool.query(
      `INSERT INTO test_scores (attempt_id, multiple_choice_score, essay_score, audio_score, total_score, passed)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [attempt_id, multiple_choice_score, essay_score, audio_score, total_score, passed]
    );
    return res.rows[0];
  }
}