import pool from '../../../../config/db';
import {
  Question,
  CreateQuestionDTO,
  UpdateQuestionDTO,
} from '../types';

export class QuestionRepository {
  async findByTestId(
    test_id: string
  ): Promise<Question[]> {
    if (!test_id) {
      return [];
    }

    const res = await pool.query(
      `
      SELECT *
      FROM questions
      WHERE test_id = $1
      ORDER BY sort_order, created_at
      `,
      [test_id]
    );

    return res.rows;
  }

  async findById(
    id: string
  ): Promise<Question | null> {
    const res = await pool.query(
      `
      SELECT *
      FROM questions
      WHERE id = $1
      `,
      [id]
    );

    return res.rows[0] || null;
  }

  async create(
    dto: CreateQuestionDTO
  ): Promise<Question> {
    const {
      test_id,
      question_type,
      question_text,
      question_image,
      answer_audio,
      answer_key,
      score,
      sort_order = 0,
      is_active = true,
    } = dto;

    const res = await pool.query(
      `
      INSERT INTO questions (
        test_id,
        question_type,
        question_text,
        question_image,
        answer_audio,
        answer_key,
        score,
        sort_order,
        is_active
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9
      )
      RETURNING *
      `,
      [
        test_id,
        question_type,
        question_text || null,
        question_image || null,
        answer_audio || null,
        answer_key || null,
        score,
        sort_order,
        is_active,
      ]
    );

    return res.rows[0];
  }

  async update(
    id: string,
    dto: UpdateQuestionDTO
  ): Promise<Question | null> {
    const fields: string[] = [];
    const values: any[] = [];

    let paramCount = 0;

    if (
      dto.question_text !==
      undefined
    ) {
      paramCount++;

      fields.push(
        `question_text = $${paramCount}`
      );

      values.push(
        dto.question_text
      );
    }

    if (
      dto.question_image !==
      undefined
    ) {
      paramCount++;

      fields.push(
        `question_image = $${paramCount}`
      );

      values.push(
        dto.question_image
      );
    }

    if (
      dto.answer_audio !==
      undefined
    ) {
      paramCount++;

      fields.push(
        `answer_audio = $${paramCount}`
      );

      values.push(
        dto.answer_audio
      );
    }

    if (
      dto.answer_key !==
      undefined
    ) {
      paramCount++;

      fields.push(
        `answer_key = $${paramCount}`
      );

      values.push(
        dto.answer_key
      );
    }

    if (
      dto.score !== undefined
    ) {
      paramCount++;

      fields.push(
        `score = $${paramCount}`
      );

      values.push(dto.score);
    }

    if (
      dto.sort_order !==
      undefined
    ) {
      paramCount++;

      fields.push(
        `sort_order = $${paramCount}`
      );

      values.push(
        dto.sort_order
      );
    }

    if (
      dto.is_active !==
      undefined
    ) {
      paramCount++;

      fields.push(
        `is_active = $${paramCount}`
      );

      values.push(
        dto.is_active
      );
    }

    if (
      fields.length === 0
    ) {
      return this.findById(id);
    }

    paramCount++;

    fields.push(
      `updated_at = now()`
    );

    values.push(id);

    const res =
      await pool.query(
        `
        UPDATE questions
        SET ${fields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
        `,
        values
      );

    return (
      res.rows[0] || null
    );
  }

  async delete(
    id: string
  ): Promise<void> {
    await pool.query(
      `
      DELETE FROM questions
      WHERE id = $1
      `,
      [id]
    );
  }

  async duplicate(
    id: string,
    newTestId?: string
  ): Promise<Question> {
    const original =
      await this.findById(id);

    if (!original) {
      throw new Error(
        'Question not found'
      );
    }

    const {
      question_type,
      question_text,
      question_image,
      answer_audio,
      answer_key,
      score,
      sort_order,
      is_active,
      test_id,
    } = original;

    const targetTest =
      newTestId || test_id;

    const copy =
      await pool.query(
        `
        INSERT INTO questions (
          test_id,
          question_type,
          question_text,
          question_image,
          answer_audio,
          answer_key,
          score,
          sort_order,
          is_active
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9
        )
        RETURNING *
        `,
        [
          targetTest,
          question_type,
          question_text,
          question_image,
          answer_audio,
          answer_key,
          score,
          sort_order,
          is_active,
        ]
      );

    if (
      question_type ===
      'MULTIPLE_CHOICE'
    ) {
      const options =
        await pool.query(
          `
          SELECT *
          FROM question_options
          WHERE question_id = $1
          `,
          [id]
        );

      for (const opt of options.rows) {
        await pool.query(
          `
          INSERT INTO question_options (
            question_id,
            option_text,
            option_image,
            is_correct
          )
          VALUES (
            $1,$2,$3,$4
          )
          `,
          [
            copy.rows[0].id,
            opt.option_text,
            opt.option_image,
            opt.is_correct,
          ]
        );
      }
    }

    return copy.rows[0];
  }
}