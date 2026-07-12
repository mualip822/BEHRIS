import multer, {
  FileFilterCallback,
} from "multer";

import path from "path";
import fs from "fs";

import { Request } from "express";

// =====================================
// FOLDER UPLOAD
// =====================================

const uploadDir = path.join(
  process.cwd(),
  "uploads",
  "apply"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// =====================================
// STORAGE
// =====================================

const storage = multer.diskStorage({
  destination: (
    _req,
    _file,
    cb
  ) => {
    cb(null, uploadDir);
  },

  filename: (
    _req,
    file,
    cb
  ) => {
    const ext = path
      .extname(file.originalname)
      .toLowerCase();

    const randomStr = Math.random()
      .toString(36)
      .substring(2, 8);

    const timestamp =
      Date.now();

    cb(
      null,
      `${timestamp}-${randomStr}${ext}`
    );
  },
});

// =====================================
// FILE FILTER
// =====================================

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  if (
    allowedMimes.includes(
      file.mimetype
    )
  ) {
    return cb(null, true);
  }

  cb(
    new Error(
      "Format file tidak diizinkan. Hanya PDF, JPG, JPEG dan PNG"
    )
  );
};

// =====================================
// EXPORT MULTER
// =====================================

export const uploadApply =
  multer({
    storage,

    limits: {
      fileSize:
        2 * 1024 * 1024, // 2MB
    },

    fileFilter,
  });