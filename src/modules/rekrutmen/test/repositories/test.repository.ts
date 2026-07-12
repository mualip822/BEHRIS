import pool from '../../../../config/db';
import {
  Test,
  CreateTestDTO,
  UpdateTestDTO,
} from '../types';

export class TestRepository {
  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    tests: Test[];
    total: number;
  }> {
    const offset =
      (page - 1) * limit;

    const countRes =
      await pool.query(
        'SELECT COUNT(*) FROM tests'
      );

    const total = parseInt(
      countRes.rows[0].count,
      10
    );

    const res = await pool.query(
      `
      SELECT *
      FROM tests
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    return {
      tests: res.rows,
      total,
    };
  }

  async findById(
    id: string
  ): Promise<Test | null> {
    const res = await pool.query(
      `
      SELECT *
      FROM tests
      WHERE id = $1
      `,
      [id]
    );

    return res.rows[0] || null;
  }

  async create(
    dto: CreateTestDTO,
    created_by: string
  ): Promise<Test> {
    console.log(
      'REPOSITORY CREATED_BY:',
      created_by
    );

    const {
      title,
      description,
      duration_minutes,
      is_active = true,
    } = dto;

    const res = await pool.query(
      `
      INSERT INTO tests (
        title,
        description,
        duration_minutes,
        is_active,
        created_by
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5
      )
      RETURNING *
      `,
      [
        title,
        description || null,
        duration_minutes,
        is_active,
        created_by,
      ]
    );

    return res.rows[0];
  }

  async update(
    id: string,
    dto: UpdateTestDTO
  ): Promise<Test | null> {
    const fields: string[] = [];
    const values: any[] = [];

    let paramCount = 0;

    if (
      dto.title !== undefined
    ) {
      paramCount++;
      fields.push(
        `title = $${paramCount}`
      );
      values.push(dto.title);
    }

    if (
      dto.description !== undefined
    ) {
      paramCount++;
      fields.push(
        `description = $${paramCount}`
      );
      values.push(dto.description);
    }

    if (
      dto.duration_minutes !==
      undefined
    ) {
      paramCount++;
      fields.push(
        `duration_minutes = $${paramCount}`
      );
      values.push(
        dto.duration_minutes
      );
    }

    if (
      dto.is_active !== undefined
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

    const res = await pool.query(
      `
      UPDATE tests
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
      DELETE FROM tests
      WHERE id = $1
      `,
      [id]
    );
  }

  async isActive(
    id: string
  ): Promise<boolean> {
    const res =
      await pool.query(
        `
        SELECT is_active
        FROM tests
        WHERE id = $1
        `,
        [id]
      );

    return (
      res.rows[0]?.is_active ??
      false
    );
  }

  // =====================================================
  // ACTIVE TESTS
  // =====================================================

  async getActiveTests(): Promise<
    Test[]
  > {
    const res = await pool.query(
      `
      SELECT *
      FROM tests
      WHERE is_active = true
      ORDER BY title ASC
      `
    );

    return res.rows;
  }
}