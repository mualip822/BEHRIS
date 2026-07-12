import {
  Request,
  Response,
  NextFunction,
} from 'express';

import { TestService } from '../services/test.service';

import {
  createTestSchema,
  updateTestSchema,
} from '../validations/test.validation';

import {
  success,
  created,
  paginated,
} from '../../../../core/utils/response';

import { ZodError } from 'zod';

const service =
  new TestService();

export class TestController {
  async list(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const page =
        Number(
          req.query.page
        ) || 1;

      const limit =
        Number(
          req.query.limit
        ) || 10;

      const {
        tests,
        total,
      } =
        await service.list(
          page,
          limit
        );

      return paginated(
        res,
        tests,
        total,
        page,
        limit
      );
    } catch (error) {
      return next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const test =
        await service.getById(
          req.params.id
        );

      return success(
        res,
        test
      );
    } catch (error) {
      return next(error);
    }
  }

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (
        !(req as any).user?.id
      ) {
        return res
          .status(401)
          .json({
            success:
              false,
            message:
              'Unauthorized',
          });
      }

      console.log(
        '=== CREATE TEST ==='
      );

      console.log(
        'BODY:',
        req.body
      );

      console.log(
        'USER:',
        (req as any).user
      );

      const validation =
        createTestSchema.parse(
          {
            body: req.body,
          }
        );

      const test =
        await service.create(
          validation.body,
          String(
            (req as any)
              .user.id
          )
        );

      return created(
        res,
        test,
        'Test created'
      );
    } catch (
      error: any
    ) {
      console.error(
        'CREATE TEST ERROR:'
      );

      console.error(
        error
      );

      if (
        error instanceof
        ZodError
      ) {
        return res
          .status(400)
          .json({
            success:
              false,
            message:
              'Validation Error',
            errors:
              error.issues,
          });
      }

      return next(error);
    }
  }

  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (
        !(req as any).user?.id
      ) {
        return res
          .status(401)
          .json({
            success:
              false,
            message:
              'Unauthorized',
          });
      }

      const validation =
        updateTestSchema.parse(
          {
            params:
              req.params,
            body: req.body,
          }
        );

      const test =
        await service.update(
          validation
            .params.id,
          validation.body
        );

      return success(
        res,
        test,
        'Test updated'
      );
    } catch (
      error: any
    ) {
      if (
        error instanceof
        ZodError
      ) {
        return res
          .status(400)
          .json({
            success:
              false,
            message:
              'Validation Error',
            errors:
              error.issues,
          });
      }

      return next(error);
    }
  }

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await service.delete(
        req.params.id
      );

      return success(
        res,
        null,
        'Test deleted'
      );
    } catch (error) {
      return next(error);
    }
  }

  // =====================================================
  // ACTIVE TESTS
  // =====================================================

  async getActiveTests(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const tests =
        await service.getActiveTests();

      return success(
        res,
        tests,
        'Daftar test aktif'
      );
    } catch (error) {
      return next(error);
    }
  }
}