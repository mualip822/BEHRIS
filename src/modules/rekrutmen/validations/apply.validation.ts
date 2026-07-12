import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateApply = [
  body("lowongan_id")
    .isInt({ min: 1 })
    .withMessage("Lowongan wajib dipilih"),

  body("expected_location")
    .notEmpty()
    .withMessage("Lokasi yang diharapkan wajib diisi"),

  body("motivasi")
    .notEmpty()
    .withMessage("Motivasi wajib diisi"),

  body("motivasi_skala")
    .isInt({ min: 0, max: 10 })
    .withMessage("Skala motivasi harus antara 0 sampai 10"),

  body("gaji")
    .notEmpty()
    .withMessage("Ekspektasi gaji wajib diisi"),

  body("deskripsi")
    .notEmpty()
    .withMessage("Deskripsi wajib diisi"),

  body("jelaskan_diri")
    .notEmpty()
    .withMessage("Jelaskan diri wajib diisi"),

  body("rutin_kajian")
    .notEmpty()
    .withMessage("Rutin kajian wajib diisi"),

  body("ulama_internasional")
    .notEmpty()
    .withMessage("Ulama internasional wajib diisi"),

  body("ulama_indonesia")
    .notEmpty()
    .withMessage("Ulama Indonesia wajib diisi"),

  body("situs_islam")
    .notEmpty()
    .withMessage("Situs Islam wajib diisi"),

  body("media_rujukan")
    .notEmpty()
    .withMessage("Media rujukan wajib diisi"),

  body("sumber_info")
    .notEmpty()
    .withMessage("Sumber informasi wajib diisi"),

  body("hobi")
    .notEmpty()
    .withMessage("Hobi wajib diisi"),

  body("riwayat_sakit")
    .notEmpty()
    .withMessage("Riwayat sakit wajib diisi"),

  body("mulai_kerja")
    .notEmpty()
    .withMessage("Waktu mulai kerja wajib diisi"),

  body("siap_bekerja")
    .isISO8601()
    .withMessage(
      "Tanggal siap bekerja harus format YYYY-MM-DD"
    ),

  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: "Validation Error",
        errors: errors.array(),
      });
    }

    next();
  },
];