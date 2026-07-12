import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Nama kategori minimal 2 karakter'),
  slug: z.string().min(2, 'Slug minimal 2 karakter').regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung'),
  icon: z.string().emoji().or(z.string().max(2)).optional().default('📁'),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createJobTypeSchema = z.object({
  name: z.string().min(2, 'Nama tipe pekerjaan minimal 2 karakter'),
  slug: z.string().min(2, 'Slug minimal 2 karakter').regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung'),
  icon: z.string().emoji().or(z.string().max(2)).optional().default('💼'),
});

export const updateJobTypeSchema = createJobTypeSchema.partial();