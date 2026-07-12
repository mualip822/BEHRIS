export interface Profile {
  id?: number;

  user_id: number;

  nik: string;

  nama: string;

  email: string;

  hp?: string;

  alamat?: string;

  pendidikan?: string;

  avatar?: string;

  tempat_lahir?: string;

  tanggal_lahir?: string;

  jenis_kelamin?: string;

  agama?: string;

  status_pernikahan?: string;

  instagram?: string;

  facebook?: string;

  linkedin?: string;

  twitter?: string;

  tiktok?: string;

  provinsi?: string;

  kota?: string;

  kecamatan?: string;

  kode_pos?: string;

  role?: string;

  status?: string;

  created_at?: Date;

  updated_at?: Date;
}