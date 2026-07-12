import pool from "../../../config/db";
import { Message } from '../types/message.types';

export class MessageRepository {
  // Admin: kirim pesan ke kandidat (apply_id)
 async createMessage(
  applyId: number,
  senderId: string,
  receiverId: string,
  subject: string,
  body: string
): Promise<Message> {
    const query = `
      INSERT INTO messages (apply_id, sender_id, receiver_id, subject, body)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(query, [applyId, senderId, receiverId, subject, body]);
    return result.rows[0];
  }

  // Admin: lihat semua pesan untuk suatu lamaran (apply_id)
  async getMessagesByApplyId(applyId: number): Promise<Message[]> {
    const query = `
      SELECT m.*, 
        (SELECT full_name FROM profiles WHERE user_id = m.sender_id) as sender_name
      FROM messages m
      WHERE m.apply_id = $1
      ORDER BY m.created_at DESC
    `;
    const result = await pool.query(query, [applyId]);
    return result.rows;
  }

  // User: lihat semua pesan untuk user login (berdasarkan receiver_id)
  async getMessagesByUserId(userId: string): Promise<Message[]> {
    const query = `
      SELECT m.*, 
        (SELECT nama_lengkap FROM job_applies WHERE id = m.apply_id) as apply_nama,
        (SELECT posisi FROM job_applies WHERE id = m.apply_id) as apply_posisi
      FROM messages m
      WHERE m.receiver_id = $1
      ORDER BY m.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // User: tandai pesan sudah dibaca
  async markAsRead(messageId: string): Promise<void> {
    await pool.query('UPDATE messages SET is_read = true WHERE id = $1', [messageId]);
  }

  // Mendapatkan user_id pelamar dari apply_id
  
async getUserIdByApplyId(applyId: number): Promise<string | null> {
  const result = await pool.query(
    `
    SELECT u.uuid
    FROM job_applies ja
    INNER JOIN users u
      ON u.uuid = ja.user_id
    WHERE ja.id = $1
    `,
    [applyId]
  );

  console.log("USER UUID:", result.rows[0]);

  return result.rows[0]?.uuid ?? null;
}
}