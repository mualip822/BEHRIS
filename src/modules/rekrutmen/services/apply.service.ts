import { ApplyRepository } from "../repositories/apply.repository";

import {
  ApplyFormInput,
  CreateApplyData,
} from "../types/apply.types";

export class ApplyService {

  // =====================================
  // CREATE APPLY
  // =====================================

  static async apply(
    userId: string,
    lowonganId: number,
    form: ApplyFormInput,

    files: {
      cv?: Express.Multer.File[];
      ijazah?: Express.Multer.File[];
      transkrip?: Express.Multer.File[];
      pendukung?: Express.Multer.File[];
    }
  ) {

    // PROFILE
    const profile =
      await ApplyRepository.getProfileByUserId(
        userId
      );

    if (!profile) {
      throw new Error(
        "Profil belum dilengkapi"
      );
    }


    // LOWONGAN
    const lowongan =
      await ApplyRepository.getLowonganById(
        lowonganId
      );

    if (!lowongan) {
      throw new Error(
        "Lowongan tidak ditemukan"
      );
    }


    // DUPLIKAT
    const existing =
      await ApplyRepository.findExistingApply(
        userId,
        lowonganId
      );

    if (existing) {
      throw new Error(
        "Anda sudah pernah melamar pada lowongan ini"
      );
    }


    // VALIDASI FILE

    if (!files.cv?.length) {
      throw new Error(
        "File CV wajib diupload"
      );
    }

    if (!files.ijazah?.length) {
      throw new Error(
        "File ijazah wajib diupload"
      );
    }

    if (!files.transkrip?.length) {
      throw new Error(
        "File transkrip wajib diupload"
      );
    }


    // MAPPING DATA

    const data: CreateApplyData = {

      // UUID
      user_id: userId,

      lowongan_id: lowonganId,


      // PROFILE

      nama_lengkap:
        profile.nama ?? "",

      email:
        profile.email ?? "",

      nik:
        profile.nik ?? "",

      no_hp:
        profile.hp ?? "",


      tempat_lahir:
        profile.tempat_lahir ?? null,

      tanggal_lahir:
        profile.tanggal_lahir ?? null,


      agama:
        profile.agama ?? null,


      jenis_kelamin:
        profile.jenis_kelamin ?? null,


      status_menikah:
        profile.status_pernikahan ?? null,


      pendidikan_terakhir:
        profile.pendidikan ?? null,


      provinsi:
        profile.provinsi ?? null,


      kota:
        profile.kota ?? null,


      kecamatan:
        profile.kecamatan ?? null,


      alamat_lengkap:
        profile.alamat ?? null,


      instagram:
        profile.instagram ?? null,

      tiktok:
        profile.tiktok ?? null,

      linkedin:
        profile.linkedin ?? null,

      twitter:
        profile.twitter ?? null,



      // LOWONGAN

      posisi:
        lowongan.title ?? null,

      lembaga:
        lowongan.perusahaan ?? null,

      lokasi:
        lowongan.lokasi ?? null,



      // FORM

      expected_location:
        form.expected_location,

      priority_first:
        form.priority_first ?? null,

      motivasi:
        form.motivasi,

      motivasi_skala:
        form.motivasi_skala,

      gaji:
        form.gaji,

      deskripsi:
        form.deskripsi,

      jelaskan_diri:
        form.jelaskan_diri,

      rutin_kajian:
        form.rutin_kajian,

      ustadz_kajian:
        form.ustadz_kajian ?? null,

      ulama_internasional:
        form.ulama_internasional,

      ulama_indonesia:
        form.ulama_indonesia,

      situs_islam:
        form.situs_islam,

      media_rujukan:
        form.media_rujukan,

      sumber_info:
        form.sumber_info,

      sumber_info_lain:
        form.sumber_info_lain ?? null,

      hobi:
        form.hobi,

      riwayat_sakit:
        form.riwayat_sakit,

      mulai_kerja:
        form.mulai_kerja,

      siap_bekerja:
        form.siap_bekerja,


      pengabdian:
        null,


      // FILE

      cv_file:
        files.cv[0].filename,

      ijazah_file:
        files.ijazah[0].filename,

      transkrip_file:
        files.transkrip[0].filename,

      pendukung_file:
        files.pendukung?.[0]?.filename ?? null,


      status:
        "pending",
    };


    const result =
      await ApplyRepository.createApply(
        data
      );


    return {
      ...result,

      cv_url:
        result.cv_file
          ? `/uploads/apply/${result.cv_file}`
          : null,


      ijazah_url:
        result.ijazah_file
          ? `/uploads/apply/${result.ijazah_file}`
          : null,


      transkrip_url:
        result.transkrip_file
          ? `/uploads/apply/${result.transkrip_file}`
          : null,


      pendukung_url:
        result.pendukung_file
          ? `/uploads/apply/${result.pendukung_file}`
          : null,
    };
  }



  // =====================================
  // LIST MY APPLICATION
  // =====================================

  static async getMyApplications(
    userId: string
  ) {

    const data =
      await ApplyRepository.getMyApplications(
        userId
      );


    return data.map(
      (item:any)=>({

        ...item,


        cv_url:
          item.cv_file
          ? `/uploads/apply/${item.cv_file}`
          : null,


        ijazah_url:
          item.ijazah_file
          ? `/uploads/apply/${item.ijazah_file}`
          : null,


        transkrip_url:
          item.transkrip_file
          ? `/uploads/apply/${item.transkrip_file}`
          : null,


        pendukung_url:
          item.pendukung_file
          ? `/uploads/apply/${item.pendukung_file}`
          : null,

      })
    );
  }



  // =====================================
  // DETAIL
  // =====================================

  static async getById(
    id:number
  ){

    const data =
      await ApplyRepository.getById(
        id
      );


    if(!data){
      throw new Error(
        "Lamaran tidak ditemukan"
      );
    }


    return data;
  }

}