
import { z } from 'zod';

// =====================================================
// BASE SCHEMA
// =====================================================

const baseLowonganSchema = z.object({

  // =====================================================
  // BASIC INFO
  // =====================================================

  title: z
    .string()
    .min(3, 'Judul minimal 3 karakter')
    .max(200, 'Judul terlalu panjang'),

  perusahaan: z
    .string()
    .min(2, 'Nama perusahaan minimal 2 karakter')
    .max(150, 'Nama perusahaan terlalu panjang'),

  divisi: z
    .string()
    .max(100, 'Divisi terlalu panjang')
    .optional(),

  lokasi: z
    .string()
    .min(2, 'Lokasi minimal 2 karakter')
    .max(150, 'Lokasi terlalu panjang'),

  deskripsi: z
    .string()
    .min(20, 'Deskripsi minimal 20 karakter'),

  tentang_posisi: z
    .string()
    .min(10, 'Tentang posisi minimal 10 karakter'),

  // =====================================================
  // CATEGORY & JOB TYPE
  // =====================================================

  kategori_id: z
    .coerce
    .number()
    .min(1, 'Kategori wajib dipilih'),

  tipe_pekerjaan_id: z
    .coerce
    .number()
    .min(1, 'Tipe pekerjaan wajib dipilih'),

  // =====================================================
  // SALARY
  // =====================================================

  gaji_min: z
    .coerce
    .number()
    .min(0, 'Gaji minimal tidak boleh minus'),

  gaji_max: z
    .coerce
    .number()
    .min(0, 'Gaji maksimal tidak boleh minus'),

  // =====================================================
  // OPTIONAL INFO
  // =====================================================

  pengalaman: z
    .string()
    .max(100, 'Pengalaman terlalu panjang')
    .optional(),

  pendidikan: z
    .string()
    .max(100, 'Pendidikan terlalu panjang')
    .optional(),

  // =====================================================
  // ARRAY DATA
  // =====================================================

  skills: z
    .array(
      z.string().min(1, 'Skill tidak boleh kosong')
    )
    .min(1, 'Minimal 1 skill wajib diisi'),

  persyaratan: z.array(
    z.string().min(1, 'Persyaratan tidak boleh kosong')
  ),

  tanggung_jawab: z.array(
    z.string().min(1, 'Tanggung jawab tidak boleh kosong')
  ),

  benefit: z.array(
    z.string().min(1, 'Benefit tidak boleh kosong')
  ),

  // =====================================================
  // DEADLINE
  // =====================================================

  deadline: z
    .union([
      z.date(),
      z.string(),
    ])
    .nullable()
    .optional(),

  // =====================================================
  // STATUS
  // =====================================================

  is_active: z
    .boolean()
    .optional(),
});


// =====================================================
// CREATE VALIDATION
// =====================================================

export const createLowonganSchema =
  baseLowonganSchema.refine(
    (data) => data.gaji_max >= data.gaji_min,
    {
      message:
        'Gaji maksimal harus lebih besar atau sama dengan gaji minimal',

      path: ['gaji_max'],
    }
  );


// =====================================================
// UPDATE VALIDATION
// =====================================================

export const updateLowonganSchema =
  baseLowonganSchema
    .partial()
    .refine(
      (data) => {

        // skip jika salah satu kosong
        if (
          data.gaji_min === undefined ||
          data.gaji_max === undefined
        ) {
          return true;
        }

        return data.gaji_max >= data.gaji_min;
      },
      {
        message:
          'Gaji maksimal harus lebih besar atau sama dengan gaji minimal',

        path: ['gaji_max'],
      }
    );
