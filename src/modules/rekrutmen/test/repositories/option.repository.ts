import pool from '../../../../config/db';
import { QuestionOption, CreateOptionDTO, UpdateOptionDTO } from '../types';

export class OptionRepository {
  async findByQuestionId(question_id: string): Promise<QuestionOption[]> {
    const res = await pool.query('SELECT * FROM question_options WHERE question_id = $1', [question_id]);
    return res.rows;
  }

  async findById(id: string): Promise<QuestionOption | null> {
    const res = await pool.query('SELECT * FROM question_options WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async create(dto: CreateOptionDTO): Promise<QuestionOption> {
    const { question_id, option_text, option_image, is_correct } = dto;
    const res = await pool.query(
      `INSERT INTO question_options (question_id, option_text, option_image, is_correct) 
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [question_id, option_text || null, option_image || null, is_correct]
    );
    return res.rows[0];
  }

  async update(id: string, dto: UpdateOptionDTO): Promise<QuestionOption | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    if (dto.option_text !== undefined) {
      paramCount++;
      fields.push(`option_text = $${paramCount}`);
      values.push(dto.option_text);
    }
    if (dto.option_image !== undefined) {
      paramCount++;
      fields.push(`option_image = $${paramCount}`);
      values.push(dto.option_image);
    }
    if (dto.is_correct !== undefined) {
      paramCount++;
      fields.push(`is_correct = $${paramCount}`);
      values.push(dto.is_correct);
    }
    if (fields.length === 0) return this.findById(id);

    paramCount++;
    fields.push(`updated_at = now()`);
    values.push(id);

    const res = await pool.query(
      `UPDATE question_options SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return res.rows[0] || null;
  }

  async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM question_options WHERE id = $1', [id]);
  }

  async getCorrectOptionIds(question_id: string): Promise<string[]> {
    const res = await pool.query(
      'SELECT id FROM question_options WHERE question_id = $1 AND is_correct = true',
      [question_id]
    );
    return res.rows.map(row => row.id);
  }
}