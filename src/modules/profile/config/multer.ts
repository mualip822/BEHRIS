import multer from "multer";

import path from "path";

import fs from "fs";

const uploadPath = path.join(
  process.cwd(),
  "uploads/avatar"
);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath);
  },

  filename: (_req, file, cb) => {
    const ext = path.extname(
      file.originalname
    );

    const filename = `${Date.now()}${ext}`;

    cb(null, filename);
  },
});

export const uploadAvatar = multer({
  storage,

  limits: {
    fileSize: 2 * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(
        new Error("Format file tidak didukung")
      );
    }

    cb(null, true);
  },
});