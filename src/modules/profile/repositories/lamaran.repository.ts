import pool from "../../../config/db";

import { JobApply } from '../types/lamaran.types';

export class LamaranRepository {
  async findByUserId(userId: string): Promise<JobApply[]> {
    const query = 'SELECT * FROM job_applies WHERE user_id = $1 ORDER BY created_at DESC';
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  async findByIdAndUserId(
  id: number,
  userId: string
): Promise<JobApply | null> {
    const query = 'SELECT * FROM job_applies WHERE id = $1 AND user_id = $2 LIMIT 1';
    const { rows } = await pool.query(query, [id, userId]);
    return rows[0] || null;
  }
}