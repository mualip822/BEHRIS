import pool from '../../../../config/db';
import { TestAnswer, AnswerQuestionDTO } from '../types';

export class AnswerRepository {
  async createOrUpdate(dto: AnswerQuestionDTO): Promise<TestAnswer> {
    const {
      attempt_id,
      question_id,
      selected_option_id,
      answer_text,
      answer_image,
      answer_audio,
    } = dto;

    // cek apakah jawaban sudah ada
    const existing = await pool.query(
      `
      SELECT id
      FROM test_answers
      WHERE attempt_id = $1
      AND question_id = $2
      `,
      [attempt_id, question_id]
    );

    if (existing.rows.length > 0) {
      const answerId = existing.rows[0].id;

      const res = await pool.query(
        `
        UPDATE test_answers
        SET
          selected_option_id = $2::uuid,
          answer_text        = $3::text,
          answer_image       = $4::text,
          answer_audio       = $5::text
        WHERE id = $1
        RETURNING *
        `,
        [
          answerId,
          selected_option_id ?? null,
          answer_text ?? null,
          answer_image ?? null,
          answer_audio ?? null,
        ]
      );

      return res.rows[0];
    }

    const res = await pool.query(
      `
      INSERT INTO test_answers
      (
        attempt_id,
        question_id,
        selected_option_id,
        answer_text,
        answer_image,
        answer_audio
      )
      VALUES
      (
        $1::uuid,
        $2::uuid,
        $3::uuid,
        $4::text,
        $5::text,
        $6::text
      )
      RETURNING *
      `,
      [
        attempt_id,
        question_id,
        selected_option_id ?? null,
        answer_text ?? null,
        answer_image ?? null,
        answer_audio ?? null,
      ]
    );

    return res.rows[0];
  }

  async findByAttemptId(attempt_id: string): Promise<TestAnswer[]> {
    const res = await pool.query(
      `
      SELECT *
      FROM test_answers
      WHERE attempt_id = $1
      `,
      [attempt_id]
    );

    return res.rows;
  }

  async updateScore(id: string, score: number): Promise<void> {
    await pool.query(
      `
      UPDATE test_answers
      SET score = $2
      WHERE id = $1
      `,
      [id, score]
    );
  }
}