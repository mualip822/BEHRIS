import pool from "../../../config/db";
import { CreateApplyData } from "../types/apply.types";

export class ApplyRepository {

  static async getProfileByUserId(
    userId: string
  ) {

    const query = `
      SELECT
        id,
        user_id,
        nik,
        nama,
        email,
        hp,
        alamat,
        pendidikan,
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
        kecamatan
      FROM profiles
      WHERE user_id = $1
    `;

    const result =
      await pool.query(query, [userId]);

    return result.rows[0] || null;
  }



  static async getLowonganById(
    lowonganId:number
  ){

    const query = `
      SELECT
        id,
        title,
        perusahaan,
        lokasi
      FROM lowongans
      WHERE id=$1
    `;


    const result =
      await pool.query(query,[lowonganId]);

    return result.rows[0] || null;
  }



  static async findExistingApply(
    userId:string,
    lowonganId:number
  ){

    const query = `
      SELECT id
      FROM job_applies
      WHERE user_id=$1
      AND lowongan_id=$2
      LIMIT 1
    `;


    const result =
      await pool.query(
        query,
        [
          userId,
          lowonganId
        ]
      );


    return result.rows[0] || null;
  }




  static async createApply(
    data:CreateApplyData
  ){

    const keys =
      Object.keys(data);

    const values =
      Object.values(data);


    const query = `
      INSERT INTO job_applies
      (
        ${keys.join(",")}
      )

      VALUES
      (
        ${keys
        .map(
          (_,i)=>`$${i+1}`
        )
        .join(",")}
      )

      RETURNING *
    `;


    const result =
      await pool.query(
        query,
        values
      );


    return result.rows[0];
  }




  static async getMyApplications(
    userId:string
  ){

    const query = `
      SELECT
        ja.*,
        l.title AS lowongan_title,
        l.perusahaan,
        l.lokasi AS lowongan_lokasi

      FROM job_applies ja

      LEFT JOIN lowongans l
      ON l.id = ja.lowongan_id

      WHERE ja.user_id=$1

      ORDER BY ja.created_at DESC
    `;


    const result =
      await pool.query(
        query,
        [userId]
      );


    return result.rows;
  }




  static async getById(
    id:number
  ){

    const query = `
      SELECT
        ja.*,
        l.title AS lowongan_title,
        l.perusahaan,
        l.lokasi AS lowongan_lokasi

      FROM job_applies ja

      LEFT JOIN lowongans l
      ON l.id = ja.lowongan_id

      WHERE ja.id=$1
    `;


    const result =
      await pool.query(
        query,
        [id]
      );


    return result.rows[0] || null;
  }


}