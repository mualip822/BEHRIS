import { z } from 'zod'
import { QuestionType } from '../types'


// =====================================================
// CREATE QUESTION VALIDATION
// =====================================================

export const createQuestionSchema = z.object({

  test_id: z.string().uuid(
    'Invalid test ID'
  ),


  question_type:
    z.nativeEnum(
      QuestionType
    ),


  question_text:
    z.string()
      .optional()
      .nullable(),


  question_image:
    z.string()
      .nullable()
      .optional(),


  answer_key:
    z.string()
      .optional()
      .nullable(),


  score: z.coerce
    .number()
    .int()
    .positive(
      'Score must be positive'
    ),


  sort_order: z.coerce
    .number()
    .int()
    .min(0)
    .optional(),


  is_active:
    z.coerce
      .boolean()
      .optional(),


  options: z
    .array(

      z.object({

        option_text:
          z.string()
            .optional()
            .nullable(),


        option_image:
          z.string()
            .nullable()
            .optional(),


        is_correct:
          z.coerce
            .boolean(),

      })

    )
    .optional(),


})



export type CreateQuestionInput =
  z.infer<
    typeof createQuestionSchema
  >



// =====================================================
// UPDATE QUESTION VALIDATION
// =====================================================

export const updateQuestionSchema =
z.object({

  params: z.object({

    id:
      z.string()
       .uuid(),

  }),


  body: z.object({

    question_type:
      z.nativeEnum(
        QuestionType
      )
      .optional(),



    question_text:
      z.string()
       .optional()
       .nullable(),



    question_image:
      z.string()
       .nullable()
       .optional(),



    answer_key:
      z.string()
       .optional()
       .nullable(),



    score:

      z.coerce
       .number()
       .int()
       .positive()
       .optional(),



    sort_order:

      z.coerce
       .number()
       .int()
       .min(0)
       .optional(),



    is_active:

      z.coerce
       .boolean()
       .optional(),



    options:

      z.array(

        z.object({

          option_text:

            z.string()
             .optional()
             .nullable(),



          option_image:

            z.string()
             .nullable()
             .optional(),



          is_correct:

            z.coerce
             .boolean(),

        })

      )
      .optional(),


  })
  .strict(),

})
.strict()



export type UpdateQuestionInput =
  z.infer<
    typeof updateQuestionSchema
  >