import { MessageRepository } from '../repositories/message.repository';
import pool from '../../../config/db';

export class MessageService {
  private messageRepo = new MessageRepository();

  /**
   * Admin kirim pesan biasa
   */
  async sendMessage(
    applyId: number,
    senderId: string,
    subject: string,
    body: string
  ) {
    const receiverId =
      await this.messageRepo.getUserIdByApplyId(applyId);

    console.log('SEND MESSAGE DEBUG', {
      applyId,
      senderId,
      receiverId,
    });

    if (!receiverId) {
      throw new Error('Lamaran tidak ditemukan');
    }

    return this.messageRepo.createMessage(
      applyId,
      senderId,
      receiverId,
      subject,
      body
    );
  }

  /**
   * Admin kirim pesan + assign test
   */
  async sendTestMessage(
    applyId: number,
    senderId: string,
    subject: string,
    body: string,
    testId: string
  ) {
    const receiverId =
      await this.messageRepo.getUserIdByApplyId(applyId);

    if (!receiverId) {
      throw new Error('Lamaran tidak ditemukan');
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      console.log('========== SEND TEST ==========');
      console.log('Candidate :', receiverId);
      console.log('Test      :', testId);
      console.log('Sender    :', senderId);

      /**
       * 1. Simpan pesan
       */
      const msgResult = await client.query(
        `
        INSERT INTO messages
        (
          apply_id,
          sender_id,
          receiver_id,
          subject,
          body
        )
        VALUES
        (
          $1,$2,$3,$4,$5
        )
        RETURNING *
        `,
        [
          applyId,
          senderId,
          receiverId,
          subject,
          body,
        ]
      );

      const message = msgResult.rows[0];

      /**
       * 2. Cek apakah assignment sudah ada
       */
      const existing = await client.query(
        `
        SELECT *
        FROM candidate_tests
        WHERE candidate_id=$1
        AND test_id=$2
        LIMIT 1
        `,
        [
          receiverId,
          testId,
        ]
      );

      let assignment;

      if (existing.rows.length > 0) {

        console.log('Assignment sudah ada.');

        const update = await client.query(
          `
          UPDATE candidate_tests
          SET
            assigned_by = $1,
            assigned_at = NOW(),
            status = 'assigned'
          WHERE id = $2
          RETURNING *
          `,
          [
            senderId,
            existing.rows[0].id,
          ]
        );

        assignment = update.rows[0];

      } else {

        console.log('Membuat assignment baru.');

        const insert = await client.query(
          `
          INSERT INTO candidate_tests
          (
            candidate_id,
            test_id,
            assigned_by,
            assigned_at,
            status
          )
          VALUES
          (
            $1,
            $2,
            $3,
            NOW(),
            'assigned'
          )
          RETURNING *
          `,
          [
            receiverId,
            testId,
            senderId,
          ]
        );

        assignment = insert.rows[0];
      }

      console.log('ASSIGNMENT:', assignment);

      await client.query('COMMIT');

      return {
        message,
        assignment,
      };

    } catch (error) {

      await client.query('ROLLBACK');

      console.error('SEND TEST ERROR');
      console.error(error);

      throw error;

    } finally {
      client.release();
    }
  }

  /**
   * Admin lihat pesan berdasarkan lamaran
   */
  async getMessagesForApply(applyId: number) {
    return this.messageRepo.getMessagesByApplyId(applyId);
  }

  /**
   * Kandidat lihat pesan miliknya
   */
  async getMessagesForUser(userId: string) {
    return this.messageRepo.getMessagesByUserId(userId);
  }

  /**
   * Tandai pesan dibaca
   */
  async markMessageAsRead(messageId: string) {
    return this.messageRepo.markAsRead(messageId);
  }
}