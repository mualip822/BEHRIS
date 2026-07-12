import pool from "../../../config/db";
import { Candidate, CandidateDetail } from '../types/candidate.types';

export class CandidateRepository {
  async findAll(
    search: string,
    status: string,
    page: number,
    limit: number
  ): Promise<{ data: Candidate[]; total: number }> {
    let whereClause = '';
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (status && status !== 'semua') {
      whereClause += `WHERE ja.status = $${paramIndex++} `;
      params.push(status);
    }

    if (search) {
      const searchCondition = `${
        whereClause ? 'AND' : 'WHERE'
      } (ja.nama_lengkap ILIKE $${paramIndex} OR ja.email ILIKE $${paramIndex} OR ja.no_hp ILIKE $${paramIndex} OR l.title ILIKE $${paramIndex} OR l.lokasi ILIKE $${paramIndex} OR l.perusahaan ILIKE $${paramIndex})`;
      whereClause += searchCondition;
      params.push(`%${search}%`);
      paramIndex++;
    }

    const countQuery = `SELECT COUNT(*) FROM job_applies ja LEFT JOIN lowongans l ON l.id = ja.lowongan_id ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count, 10);

    const offset = (page - 1) * limit;

    // Ambil semua kolom dari job_applies, tambahkan alias untuk lowongan
    const dataQuery = `
      SELECT
        ja.*,
        l.title AS posisi_lowongan,
        l.lokasi AS lokasi_lowongan,
        l.perusahaan AS lembaga_lowongan
      FROM job_applies ja
      LEFT JOIN lowongans l ON l.id = ja.lowongan_id
      ${whereClause}
      ORDER BY ja.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `;
    const dataParams = [...params, limit, offset];
    const result = await pool.query(dataQuery, dataParams);

    // Transformasi agar sesuai dengan interface Candidate
    const candidates: Candidate[] = result.rows.map((row: any) => ({
      ...row,
      full_name: row.nama_lengkap,
      phone: row.no_hp,
      gender: row.jenis_kelamin,
      birth_place: row.tempat_lahir,
      birth_date: row.tanggal_lahir,
      address: row.alamat_lengkap,
      city: row.kota,
      province: row.provinsi,
      education: row.pendidikan_terakhir,
      posisi: row.posisi_lowongan || row.posisi, // jika ada kolom posisi di job_applies, gunakan itu, jika tidak dari lowongan
      lokasi: row.lokasi_lowongan || row.lokasi,
      lembaga: row.lembaga_lowongan || row.lembaga,
    }));

    return { data: candidates, total };
  }

  async findById(id: number): Promise<CandidateDetail | null> {
    const query = `
      SELECT
        ja.*,
        l.title AS posisi_lowongan,
        l.lokasi AS lokasi_lowongan,
        l.perusahaan AS lembaga_lowongan
      FROM job_applies ja
      LEFT JOIN lowongans l ON l.id = ja.lowongan_id
      WHERE ja.id = $1
    `;
    const result = await pool.query(query, [id]);
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      ...row,
      full_name: row.nama_lengkap,
      phone: row.no_hp,
      gender: row.jenis_kelamin,
      birth_place: row.tempat_lahir,
      birth_date: row.tanggal_lahir,
      address: row.alamat_lengkap,
      city: row.kota,
      province: row.provinsi,
      education: row.pendidikan_terakhir,
      posisi: row.posisi_lowongan || row.posisi,
      lokasi: row.lokasi_lowongan || row.lokasi,
      lembaga: row.lembaga_lowongan || row.lembaga,
    } as CandidateDetail;
  }

  async updateStatus(id: number, status: string): Promise<void> {
    const query = 'UPDATE job_applies SET status = $1, updated_at = NOW() WHERE id = $2';
    await pool.query(query, [status, id]);
  }
}