export interface ApplyFormInput {
  expected_location: string;
  priority_first?: number | null;

  motivasi: string;
  motivasi_skala: number;

  gaji: string;
  deskripsi: string;

  jelaskan_diri: string;

  rutin_kajian: string;
  ustadz_kajian?: string | null;

  ulama_internasional: string;
  ulama_indonesia: string;

  situs_islam: string;
  media_rujukan: string;

  sumber_info: string;
  sumber_info_lain?: string | null;

  hobi: string;
  riwayat_sakit: string;

  mulai_kerja: string;
  siap_bekerja: string | Date;
}

export interface CreateApplyData {
  user_id: string;
  lowongan_id: number;

  nama_lengkap: string;
  email: string;
  nik: string;
  no_hp: string;

  tempat_lahir?: string | null;
  tanggal_lahir?: string | Date | null;
  agama?: string | null;

  jenis_kelamin?: string | null;
  status_menikah?: string | null;
  pendidikan_terakhir?: string | null;

  provinsi?: string | null;
  kota?: string | null;
  kecamatan?: string | null;
  alamat_lengkap?: string | null;

  instagram?: string | null;
  tiktok?: string | null;
  linkedin?: string | null;
  twitter?: string | null;

  posisi?: string | null;
  lembaga?: string | null;
  lokasi?: string | null;

  expected_location: string;
  priority_first?: number | null;

  motivasi_skala: number;
  jelaskan_diri: string;
  ulama_indonesia: string;

  motivasi: string;
  pengabdian?: string | null;
  gaji: string;
  deskripsi: string;

  rutin_kajian: string;
  ustadz_kajian?: string | null;

  ulama_internasional: string;

  situs_islam: string;
  media_rujukan: string;

  sumber_info: string;
  sumber_info_lain?: string | null;

  hobi: string;
  riwayat_sakit: string;

  mulai_kerja: string;
  siap_bekerja: string | Date;

  cv_file: string;
  ijazah_file: string;
  transkrip_file: string;
  pendukung_file?: string | null;

  status: string;
}

export interface Apply {
  id: number;

  user_id: string;
  lowongan_id: number;

  nama_lengkap: string;
  email: string;
  nik: string;
  no_hp: string;

  tempat_lahir?: string | null;
  tanggal_lahir?: Date | string | null;
  agama?: string | null;

  jenis_kelamin?: string | null;
  status_menikah?: string | null;
  pendidikan_terakhir?: string | null;

  provinsi?: string | null;
  kota?: string | null;
  kecamatan?: string | null;
  alamat_lengkap?: string | null;

  instagram?: string | null;
  tiktok?: string | null;
  linkedin?: string | null;
  twitter?: string | null;

  posisi?: string | null;
  lembaga?: string | null;
  lokasi?: string | null;

  expected_location: string;
  priority_first?: number | null;

  motivasi_skala: number;
  jelaskan_diri: string;
  ulama_indonesia: string;

  motivasi: string;
  pengabdian?: string | null;
  gaji: string;
  deskripsi: string;

  rutin_kajian: string;
  ustadz_kajian?: string | null;

  ulama_internasional: string;

  situs_islam: string;
  media_rujukan: string;

  sumber_info: string;
  sumber_info_lain?: string | null;

  hobi: string;
  riwayat_sakit: string;

  mulai_kerja: string;
  siap_bekerja?: Date | string | null;

  cv_file: string;
  ijazah_file: string;
  transkrip_file: string;
  pendukung_file?: string | null;

  status: string;

  created_at?: Date;
  updated_at?: Date;
}