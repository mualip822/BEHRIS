export interface Candidate {
  id: number;
  status: 'pending' | 'review' | 'interview' | 'accepted' | 'rejected';
  created_at: string;

  cv_file: string;
  ijazah_file: string;
  transkrip_file: string;
  pendukung_file: string;

  // Data pribadi
  nama_lengkap: string;
  full_name: string; // alias
  email: string;
  phone: string; // alias no_hp
  nik: string;
  no_hp: string;

  tempat_lahir: string;
  tanggal_lahir: string;
  agama: string;
  jenis_kelamin: string;
  status_menikah: string;
  pendidikan_terakhir: string;

  provinsi: string;
  kota: string;
  kecamatan: string;
  alamat_lengkap: string;

  // Sosial media
  instagram: string;
  tiktok: string;
  linkedin: string;
  twitter: string;

  // Data lamaran
  posisi: string;
  lembaga: string;
  lokasi: string;
  expected_location: string;
  priority_first: number | null;
  motivasi_skala: number;
  jelaskan_diri: string;
  ulama_indonesia: string;
  motivasi: string;
  pengabdian: string;
  gaji: number;
  deskripsi: string;

  // Kajian
  rutin_kajian: boolean;
  ustadz_kajian: string;
  ulama_internasional: string;
  situs_islam: string;
  media_rujukan: string;

  // Informasi tambahan
  sumber_info: string;
  sumber_info_lain: string;
  hobi: string;
  riwayat_sakit: string;
  mulai_kerja: string;
  siap_bekerja: boolean;

  // Gender, birth_place, birth_date, address, city, province, education (untuk kompatibilitas)
  gender?: string;
  birth_place?: string;
  birth_date?: string;
  address?: string;
  city?: string;
  province?: string;
  education?: string;
}

export interface CandidateDetail extends Candidate {
  // sama, semua field sudah ada di Candidate
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
}

export interface UpdateStatusRequest {
  status: 'pending' | 'review' | 'interview' | 'accepted' | 'rejected';
}

export interface InterviewInvitation {
  id: number;
  apply_id: number;
  tanggal_interview: string;
  lokasi: string;
  link_meeting: string;
  catatan: string;
  created_at: string;
}

export interface InviteRequest {
  tanggal_interview: string;
  lokasi: string;
  link_meeting?: string;
  catatan?: string;
}