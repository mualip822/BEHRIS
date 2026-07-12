import pool from "../../../config/db";
import { InterviewInvitation, InviteRequest } from '../types/candidate.types';

export class InterviewRepository {
  async create(applyId: number, data: InviteRequest): Promise<InterviewInvitation> {
    const { tanggal_interview, lokasi, link_meeting = '', catatan = '' } = data;
    const query = `
      INSERT INTO interview_invitations (apply_id, tanggal_interview, lokasi, link_meeting, catatan)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(query, [applyId, tanggal_interview, lokasi, link_meeting, catatan]);
    return result.rows[0];
  }

  async findByApplyId(applyId: number): Promise<InterviewInvitation[]> {
    const query = 'SELECT * FROM interview_invitations WHERE apply_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [applyId]);
    return result.rows;
  }
}