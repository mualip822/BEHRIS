// src/modules/rekrutmen/repositories/masterData.repository.ts

import pool from "../../../config/db";

export class MasterDataRepository {

  // =====================================================
  // CATEGORY
  // =====================================================

  static async getCategories() {

    const result = await pool.query(
      "SELECT * FROM categories ORDER BY id DESC"
    );

    return result.rows;
  }

  static async getCategoryById(id: number) {

    const result = await pool.query(
      "SELECT * FROM categories WHERE id = $1",
      [id]
    );

    return result.rows[0];
  }

  static async findCategoryByName(name: string) {

    const result = await pool.query(
      "SELECT * FROM categories WHERE LOWER(name) = LOWER($1)",
      [name]
    );

    return result.rows[0];
  }

  static async createCategory(name: string) {

    const result = await pool.query(
      `
      INSERT INTO categories (name)
      VALUES ($1)
      RETURNING *
      `,
      [name]
    );

    return result.rows[0];
  }

  static async updateCategory(id: number, name: string) {

    const result = await pool.query(
      `
      UPDATE categories
      SET name = $1
      WHERE id = $2
      RETURNING *
      `,
      [name, id]
    );

    return result.rows[0];
  }

  static async deleteCategory(id: number) {

    const result = await pool.query(
      `
      DELETE FROM categories
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  }

  // =====================================================
  // JOB TYPES
  // =====================================================

  static async getJobTypes() {

    const result = await pool.query(
      "SELECT * FROM job_types ORDER BY id DESC"
    );

    return result.rows;
  }

  static async getJobTypeById(id: number) {

    const result = await pool.query(
      "SELECT * FROM job_types WHERE id = $1",
      [id]
    );

    return result.rows[0];
  }

  static async findJobTypeByName(name: string) {

    const result = await pool.query(
      "SELECT * FROM job_types WHERE LOWER(name) = LOWER($1)",
      [name]
    );

    return result.rows[0];
  }

  static async createJobType(name: string) {

    const result = await pool.query(
      `
      INSERT INTO job_types (name)
      VALUES ($1)
      RETURNING *
      `,
      [name]
    );

    return result.rows[0];
  }

  static async updateJobType(id: number, name: string) {

    const result = await pool.query(
      `
      UPDATE job_types
      SET name = $1
      WHERE id = $2
      RETURNING *
      `,
      [name, id]
    );

    return result.rows[0];
  }

  static async deleteJobType(id: number) {

    const result = await pool.query(
      `
      DELETE FROM job_types
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  }
}