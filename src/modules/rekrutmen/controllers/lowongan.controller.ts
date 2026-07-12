
import { Request, Response } from 'express';

import { LowonganService }
from '../services/lowongan.service';

import {
  createLowonganSchema,
  updateLowonganSchema,
} from '../validations/lowongan.validation';

import { LowonganFilter }
from '../types/lowongan.types';

const lowonganService = new LowonganService();

export class LowonganController {

  // =====================================================
  // GET ALL LOWONGAN
  // =====================================================

  async getAll(req: Request, res: Response) {

    try {

      const filter: LowonganFilter = {

        kategori_id:
          req.query.kategori_id
            ? Number(req.query.kategori_id)
            : undefined,

        tipe_pekerjaan_id:
          req.query.tipe_pekerjaan_id
            ? Number(req.query.tipe_pekerjaan_id)
            : undefined,

        search:
          req.query.search as string,

        // ADMIN ONLY
        show_all:
          req.query.show_all === 'true',
      };

      const lowongans =
        await lowonganService.getAllLowongan(filter);

      return res.json({
        success: true,
        message: 'Data lowongan berhasil diambil',
        data: lowongans,
      });

    } catch (error) {

      console.error('GET ALL LOWONGAN ERROR:', error);

      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan server',
      });
    }
  }


  // =====================================================
  // GET LOWONGAN BY ID
  // =====================================================

  async getById(req: Request, res: Response) {

    try {

      const id = Number(req.params.id);

      if (isNaN(id)) {

        return res.status(400).json({
          success: false,
          message: 'ID tidak valid',
        });
      }

      const lowongan =
        await lowonganService.getLowonganById(id);

      return res.json({
        success: true,
        message: 'Detail lowongan berhasil diambil',
        data: lowongan,
      });

    } catch (error) {

      console.error('GET LOWONGAN BY ID ERROR:', error);

      const status =
        error instanceof Error &&
        error.message === 'Lowongan tidak ditemukan'
          ? 404
          : 500;

      return res.status(status).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan server',
      });
    }
  }


  // =====================================================
  // CREATE LOWONGAN
  // =====================================================

  async create(req: Request, res: Response) {

    try {

      const payload = {

        ...req.body,

        kategori_id:
          req.body.kategori_id !== undefined
            ? Number(req.body.kategori_id)
            : undefined,

        tipe_pekerjaan_id:
          req.body.tipe_pekerjaan_id !== undefined
            ? Number(req.body.tipe_pekerjaan_id)
            : undefined,

        gaji_min:
          req.body.gaji_min !== undefined
            ? Number(req.body.gaji_min)
            : 0,

        gaji_max:
          req.body.gaji_max !== undefined
            ? Number(req.body.gaji_max)
            : 0,

        // DEADLINE
        deadline:
          req.body.deadline
            ? new Date(req.body.deadline)
            : null,

        // STATUS
        is_active:
          req.body.is_active !== undefined
            ? Boolean(req.body.is_active)
            : true,
      };

      const validation =
        createLowonganSchema.safeParse(payload);

      // FIX TYPESCRIPT
      if (validation.success === false) {

        return res.status(400).json({
          success: false,
          message: 'Validasi gagal',
          errors: validation.error.format(),
        });
      }

     const lowongan =
  await lowonganService.createLowongan(
    validation.data as any
  );

      return res.status(201).json({
        success: true,
        message: 'Lowongan berhasil dibuat',
        data: lowongan,
      });

    } catch (error) {

      console.error('CREATE LOWONGAN ERROR:', error);

      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan server',
      });
    }
  }


  // =====================================================
  // UPDATE LOWONGAN
  // =====================================================

  async update(req: Request, res: Response) {

    try {

      const id = Number(req.params.id);

      if (isNaN(id)) {

        return res.status(400).json({
          success: false,
          message: 'ID tidak valid',
        });
      }

      const payload = {

        ...req.body,

        kategori_id:
          req.body.kategori_id !== undefined
            ? Number(req.body.kategori_id)
            : undefined,

        tipe_pekerjaan_id:
          req.body.tipe_pekerjaan_id !== undefined
            ? Number(req.body.tipe_pekerjaan_id)
            : undefined,

        gaji_min:
          req.body.gaji_min !== undefined
            ? Number(req.body.gaji_min)
            : undefined,

        gaji_max:
          req.body.gaji_max !== undefined
            ? Number(req.body.gaji_max)
            : undefined,

        // DEADLINE
        deadline:
          req.body.deadline
            ? new Date(req.body.deadline)
            : undefined,

        // STATUS
        is_active:
          req.body.is_active !== undefined
            ? Boolean(req.body.is_active)
            : undefined,
      };

      const validation =
        updateLowonganSchema.safeParse(payload);

      // FIX TYPESCRIPT
      if (validation.success === false) {

        return res.status(400).json({
          success: false,
          message: 'Validasi gagal',
          errors: validation.error.format(),
        });
      }

      const lowongan =
  await lowonganService.updateLowongan(
    id,
    validation.data as any
  );
      return res.json({
        success: true,
        message: 'Lowongan berhasil diupdate',
        data: lowongan,
      });

    } catch (error) {

      console.error('UPDATE LOWONGAN ERROR:', error);

      const status =
        error instanceof Error &&
        error.message === 'Lowongan tidak ditemukan'
          ? 404
          : 500;

      return res.status(status).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan server',
      });
    }
  }


  // =====================================================
  // DELETE LOWONGAN
  // =====================================================

  async delete(req: Request, res: Response) {

    try {

      const id = Number(req.params.id);

      if (isNaN(id)) {

        return res.status(400).json({
          success: false,
          message: 'ID tidak valid',
        });
      }

      await lowonganService.deleteLowongan(id);

      return res.json({
        success: true,
        message: 'Lowongan berhasil dihapus',
      });

    } catch (error) {

      console.error('DELETE LOWONGAN ERROR:', error);

      const status =
        error instanceof Error &&
        error.message === 'Lowongan tidak ditemukan'
          ? 404
          : 500;

      return res.status(status).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan server',
      });
    }
  }


  // =====================================================
  // TOGGLE ACTIVE / NONACTIVE
  // =====================================================

  async toggleActive(req: Request, res: Response) {

    try {

      const id = Number(req.params.id);

      if (isNaN(id)) {

        return res.status(400).json({
          success: false,
          message: 'ID tidak valid',
        });
      }

      const { is_active } = req.body;

      if (typeof is_active !== 'boolean') {

        return res.status(400).json({
          success: false,
          message: 'is_active harus boolean',
        });
      }

      const result =
        await lowonganService.toggleStatus(
          id,
          is_active
        );

      return res.json({
        success: true,
        message:
          is_active
            ? 'Lowongan berhasil diaktifkan'
            : 'Lowongan berhasil dinonaktifkan',

        data: result,
      });

    } catch (error) {

      console.error('TOGGLE STATUS ERROR:', error);

      const status =
        error instanceof Error &&
        error.message === 'Lowongan tidak ditemukan'
          ? 404
          : 500;

      return res.status(status).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan server',
      });
    }
  }
}
