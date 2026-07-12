import { z } from "zod";

export const updateProfileSchema =
  z.object({
    nik: z.string().min(1),

    nama: z.string().min(3),

    email: z.string().email(),

    hp: z.string().optional(),

    alamat: z.string().optional(),

    pendidikan: z.string().optional(),

    tempat_lahir: z.string().optional(),

    tanggal_lahir: z.string().optional(),

    jenis_kelamin: z.string().optional(),

    agama: z.string().optional(),

    status_pernikahan:
      z.string().optional(),

    instagram: z.string().optional(),

    facebook: z.string().optional(),

    linkedin: z.string().optional(),

    twitter: z.string().optional(),

    tiktok: z.string().optional(),

    provinsi: z.string().optional(),

    kota: z.string().optional(),

    kecamatan: z.string().optional(),

    kode_pos: z.string().optional(),

    role: z.string().optional(),

    status: z.string().optional(),
  });