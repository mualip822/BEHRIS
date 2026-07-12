export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  created_at: Date;
  updated_at: Date;
}

export interface JobType {
  id: number;
  name: string;
  slug: string;
  icon: string;
  created_at: Date;
  updated_at: Date;
}

// =========================
// LOWONGAN ENTITY
// =========================
export interface Lowongan {
  id: number;
  title: string;
  perusahaan: string;
  divisi: string | null;
  lokasi: string;
  deskripsi: string;
  tentang_posisi: string;

  kategori_id: number;
  kategori?: Category;

  tipe_pekerjaan_id: number;
  tipe_pekerjaan?: JobType;

  gaji_min: number;
  gaji_max: number;

  pengalaman: string | null;
  pendidikan: string | null;

  skills: string[];
  persyaratan: string[];
  tanggung_jawab: string[];
  benefit: string[];

  tanggal_posting: Date;
  created_at: Date;
  updated_at: Date;

  // =========================
  // NEW FEATURE
  // =========================
  deadline: Date | null;
  is_active: boolean;
}

// =========================
// CREATE DTO
// =========================
export interface CreateLowonganDTO {
  title: string;
  perusahaan: string;
  divisi?: string;

  lokasi: string;
  deskripsi: string;
  tentang_posisi: string;

  kategori_id: number;
  tipe_pekerjaan_id: number;

  gaji_min: number;
  gaji_max: number;

  pengalaman?: string;
  pendidikan?: string;

  skills: string[];
  persyaratan: string[];
  tanggung_jawab: string[];
  benefit: string[];

  // NEW
  deadline?: Date;
  is_active?: boolean;
}

// =========================
// UPDATE DTO
// =========================
export type UpdateLowonganDTO = Partial<CreateLowonganDTO>;

// =========================
// FILTER
// =========================
export interface LowonganFilter {
  kategori_id?: number;
  tipe_pekerjaan_id?: number;
  search?: string;

  // NEW
  show_all?: boolean;
}

// =========================
// CATEGORY
// =========================
export interface CreateCategoryDTO {
  name: string;
  slug: string;
  icon: string;
}

export type UpdateCategoryDTO = Partial<CreateCategoryDTO>;

// =========================
// JOB TYPE
// =========================
export interface CreateJobTypeDTO {
  name: string;
  slug: string;
  icon: string;
}

export type UpdateJobTypeDTO = Partial<CreateJobTypeDTO>;