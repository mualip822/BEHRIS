import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../../../core/middlewares/error.middleware';


const UPLOADS_BASE = path.join(
  process.cwd(),
  'uploads'
);


function ensureDir(
  dir:string
){
  if(!fs.existsSync(dir)){
    fs.mkdirSync(
      dir,
      {
        recursive:true
      }
    );
  }
}

// Allowed file types
const IMAGE_TYPES = /jpeg|jpg|png|webp/;
const AUDIO_TYPES = /webm|wav|mp3/;

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    let dir = '';

    switch (file.fieldname) {
      case 'question_image':
        dir = path.join(UPLOADS_BASE, 'questions');
        break;

      case 'option_image':
        dir = path.join(UPLOADS_BASE, 'options');
        break;

      case 'answer_image':
        dir = path.join(UPLOADS_BASE, 'answers');
        break;

      case 'answer_audio':
        dir = path.join(UPLOADS_BASE, 'audio');
        break;

      default:
        return cb(
          new AppError(
            `Invalid upload field: ${file.fieldname}`,
            400
          ),
          ''
        );
    }

        ensureDir(dir);

    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      uuidv4() +
      path.extname(file.originalname).toLowerCase();

    cb(null, uniqueName);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  // AUDIO
  if (file.fieldname === 'answer_audio') {
    const validAudio =
      file.mimetype.startsWith('audio/') ||
      AUDIO_TYPES.test(
        path.extname(file.originalname).toLowerCase()
      );

    if (!validAudio) {
      return cb(
        new AppError(
          'Only audio files (webm, wav, mp3) are allowed',
          400
        )
      );
    }

    return cb(null, true);
  }

  // IMAGE
  const validImage =
    file.mimetype.startsWith('image/') &&
    IMAGE_TYPES.test(
      path.extname(file.originalname).toLowerCase()
    );

  if (!validImage) {
    return cb(
      new AppError(
        'Only image files (jpg, jpeg, png, webp) are allowed',
        400
      )
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

/**
 * Single Uploads
 */
export const uploadQuestionImage =
  upload.single('question_image');

export const uploadOptionImage =
  upload.single('option_image');

export const uploadAnswerImage =
  upload.single('answer_image');

export const uploadAnswerAudio =
  upload.single('answer_audio');

/**
 * Question Form Upload
 * Mendukung:
 * - question_image
 * - answer_audio
 */
export const uploadQuestionFiles =
  upload.fields([
    {
      name: 'question_image',
      maxCount: 1,
    },

    {
      name: 'answer_audio',
      maxCount: 1,
    },

    {
      name: 'option_image',
      maxCount: 10,
    },
  ])

/**
 * Helper URL
 */
export const getFileUrl = (
  filePath: string | null
): string | null => {
  if (!filePath) return null;

  return `${process.env.APP_URL || 'http://localhost:3000'}/${filePath.replace(
    /\\/g,
    '/'
  )}`;
};