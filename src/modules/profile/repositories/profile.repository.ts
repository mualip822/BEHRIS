import pool from "../../../config/db";

import { Profile } from "../types/profile.types";

export class ProfileRepository {
  static async findByUserId(userId: string) {
    const query = `
      SELECT *
      FROM profiles
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [
      userId,
    ]);

    return result.rows[0];
  }

 static async upsert(
  userId: string,
  data: Partial<Profile>
) {
    const query = `
      INSERT INTO profiles (
        user_id,
        nik,
        nama,
        email,
        hp,
        alamat,
        pendidikan,
        avatar,
        tempat_lahir,
        tanggal_lahir,
        jenis_kelamin,
        agama,
        status_pernikahan,
        instagram,
        facebook,
        linkedin,
        twitter,
        tiktok,
        provinsi,
        kota,
        kecamatan,
        kode_pos,
        role,
        status
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,
        $19,$20,$21,$22,$23,$24
      )

      ON CONFLICT (user_id)

      DO UPDATE SET
        nik = EXCLUDED.nik,
        nama = EXCLUDED.nama,
        email = EXCLUDED.email,
        hp = EXCLUDED.hp,
        alamat = EXCLUDED.alamat,
        pendidikan = EXCLUDED.pendidikan,
        avatar = COALESCE(EXCLUDED.avatar, profiles.avatar),
        tempat_lahir = EXCLUDED.tempat_lahir,
        tanggal_lahir = EXCLUDED.tanggal_lahir,
        jenis_kelamin = EXCLUDED.jenis_kelamin,
        agama = EXCLUDED.agama,
        status_pernikahan = EXCLUDED.status_pernikahan,
        instagram = EXCLUDED.instagram,
        facebook = EXCLUDED.facebook,
        linkedin = EXCLUDED.linkedin,
        twitter = EXCLUDED.twitter,
        tiktok = EXCLUDED.tiktok,
        provinsi = EXCLUDED.provinsi,
        kota = EXCLUDED.kota,
        kecamatan = EXCLUDED.kecamatan,
        kode_pos = EXCLUDED.kode_pos,
        role = EXCLUDED.role,
        status = EXCLUDED.status,
        updated_at = NOW()

      RETURNING *
    `;

    const values = [
      userId,
      data.nik,
      data.nama,
      data.email,
      data.hp || null,
      data.alamat || null,
      data.pendidikan || null,
      data.avatar || null,
      data.tempat_lahir || null,
      data.tanggal_lahir || null,
      data.jenis_kelamin || null,
      data.agama || null,
      data.status_pernikahan || null,
      data.instagram || null,
      data.facebook || null,
      data.linkedin || null,
      data.twitter || null,
      data.tiktok || null,
      data.provinsi || null,
      data.kota || null,
      data.kecamatan || null,
      data.kode_pos || null,
      data.role || "user",
      data.status || "active",
    ];

    const result = await pool.query(
      query,
      values
    );

    return result.rows[0];
  }

  static async delete(userId: string) {
    const query = `
      DELETE FROM profiles
      WHERE user_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [
      userId,
    ]);

    return result.rows[0];
  }
}