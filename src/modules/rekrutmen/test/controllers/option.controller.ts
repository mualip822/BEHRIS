import { Request, Response, NextFunction } from 'express';
import { OptionService } from '../services/option.service';
import {
  createOptionSchema,
  updateOptionSchema,
} from '../validations/option.validation';

import {
  success,
  created,
} from '../../../../core/utils/response';

import { ZodError } from 'zod';
import { uploadOptionImage } from '../config/multer.config';

const service = new OptionService();

export class OptionController {

  async create(req: Request, res: Response, next: NextFunction) {
    uploadOptionImage(req, res, async (err) => {
      if (err) return next(err);

      try {
        const validation = createOptionSchema.parse({
          body: req.body,
        });

        const optionImagePath = req.file ? req.file.path : undefined;

        const option = await service.create(
          validation.body,
          optionImagePath
        );

        return created(res, option, 'Option created');
      } catch (error: any) {
        if (error instanceof ZodError) {
          return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: error.issues,
          });
        }

        return next(error);
      }
    });
  }

  async update(req: Request, res: Response, next: NextFunction) {
    uploadOptionImage(req, res, async (err) => {
      if (err) return next(err);

      try {
        const validation = updateOptionSchema.parse({
          params: req.params,
          body: req.body,
        });

        const optionImagePath = req.file ? req.file.path : undefined;

        const option = await service.update(
          validation.params.id,
          validation.body,
          optionImagePath
        );

        return success(res, option, 'Option updated');
      } catch (error: any) {
        if (error instanceof ZodError) {
          return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: error.issues,
          });
        }

        return next(error);
      }
    });
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await service.delete(req.params.id);
      return success(res, null, 'Option deleted');
    } catch (error) {
      return next(error);
    }
  }
}