import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

import { QuestionService } from '../services/question.service';
import {
  createQuestionSchema,
  updateQuestionSchema,
} from '../validations/question.validation';

import { CreateQuestionDTO } from '../types';

import {
  success,
  created,
} from '../../../../core/utils/response';

import { uploadQuestionFiles } from '../config/multer.config';

const service = new QuestionService();

export class QuestionController {
  async list(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log('=== LIST QUESTIONS ===');
      console.log(req.query);

      const testId = String(
        req.query.test_id || ''
      ).trim();

      if (!testId) {
        return success(res, []);
      }

      const questions =
        await service.getByTestId(
          testId
        );

      return success(
        res,
        questions
      );
    } catch (error) {
      console.error(
        'QUESTION ERROR:'
      );
      console.error(error);
      next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const question =
        await service.getById(
          req.params.id
        );

      return success(
        res,
        question
      );
    } catch (error) {
      next(error);
    }
  }

  async create(
  req: Request,
  res: Response,
  next: NextFunction
) {

  uploadQuestionFiles(
    req,
    res,
    async (err) => {

      if (err) {
        return next(err);
      }


      try {


        console.log('=== BODY ===');
        console.dir(
          req.body,
          {depth:null}
        );


        console.log('=== FILES ===');
        console.dir(
          req.files,
          {depth:null}
        );


        if (
          req.body.options &&
          typeof req.body.options === 'string'
        ) {

          req.body.options =
            JSON.parse(
              req.body.options
            );

        }


        const files =
          req.files as {
            question_image?: Express.Multer.File[];
            answer_audio?: Express.Multer.File[];
            option_image?: Express.Multer.File[];
          };



        if (
          Array.isArray(req.body.options)
        ) {


          req.body.options =
            req.body.options.map(
              (
                opt:any,
                index:number
              ) => ({

                ...opt,

                option_image:
                  files.option_image?.[index]
                    ?.path || null

              })
            );


        }



        const data =
          createQuestionSchema.parse(
            req.body
          );



        const questionImagePath =
          files.question_image?.[0]?.path;


        const answerAudioPath =
          files.answer_audio?.[0]?.path;



        const question =
          await service.create(
            data as CreateQuestionDTO,
            questionImagePath,
            answerAudioPath
          );


        return created(
          res,
          question,
          'Question created'
        );



      } catch(error) {


        console.error(error);


        if(error instanceof ZodError){

          return res.status(400)
          .json({
            success:false,
            message:'Validation Error',
            errors:error.issues
          });

        }


        next(error);

      }


    }
  );

}

  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    uploadQuestionFiles(
      req,
      res,
      async (err) => {
        if (err) return next(err);

        try {
          if (
            req.body.options &&
            typeof req.body
              .options ===
              'string'
          ) {
            req.body.options =
              JSON.parse(
                req.body.options
              );
          }

          const data =
  updateQuestionSchema.parse({
  params: req.params,
  body: req.body,
});


const params = req.params;

const body = req.body;
          const files =
            req.files as {
              question_image?: Express.Multer.File[];
              answer_audio?: Express.Multer.File[];
            };

          const questionImagePath =
            files?.question_image?.[0]
              ?.path;

          const answerAudioPath =
            files?.answer_audio?.[0]
              ?.path;

          const question =
  await service.update(
    params.id,
    body,
    questionImagePath,
    answerAudioPath
  );

          return success(
            res,
            question,
            'Question updated'
          );
        } catch (error) {
          if (
            error instanceof
            ZodError
          ) {
            return res
              .status(400)
              .json({
                success: false,
                message:
                  'Validation Error',
                errors:
                  error.issues,
              });
          }

          next(error);
        }
      }
    );
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
        'Question deleted'
      );
    } catch (error) {
      next(error);
    }
  }

  async duplicate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } =
        req.params;

      const newTestId =
        req.body.test_id;

      const question =
        await service.duplicate(
          id,
          newTestId
        );

      return created(
        res,
        question,
        'Question duplicated'
      );
    } catch (error) {
      next(error);
    }
  }
}