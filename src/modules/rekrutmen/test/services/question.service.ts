import { QuestionRepository } from '../repositories/question.repository';
import { OptionRepository } from '../repositories/option.repository';
import {
  CreateQuestionDTO,
  UpdateQuestionDTO,
  QuestionType,
  Question,
} from '../types';

import {
  NotFoundError,
  ValidationError,
} from '../../../../core/middlewares/error.middleware';

const questionRepo = new QuestionRepository();
const optionRepo = new OptionRepository();

export class QuestionService {
  async getByTestId(testId: string) {
  const questions =
    await questionRepo.findByTestId(
      testId
    )

  const result = []

  for (const q of questions) {

    const options =
      await optionRepo.findByQuestionId(
        q.id
      )

    result.push({
      ...q,
      options,
    })
  }

  return result
}
  async getById(id: string) {
    const q = await questionRepo.findById(id);

    if (!q) {
      throw new NotFoundError(
        'Question not found'
      );
    }

    const options =
      await optionRepo.findByQuestionId(
        id
      );

    return {
      ...q,
      options,
    };
  }

  async create(
  dto: CreateQuestionDTO,
  questionImagePath?: string,
  answerAudioPath?: string
): Promise<Question> {
    if (
      dto.question_type ===
      QuestionType.MULTIPLE_CHOICE
    ) {
      if (
        !dto.options ||
        dto.options.length < 2
      ) {
        throw new ValidationError(
          'Multiple choice must have at least 2 options'
        );
      }
    }

    let answerKey =
      dto.answer_key;

    if (
      dto.question_type ===
        QuestionType.MULTIPLE_CHOICE &&
      dto.options
    ) {
      const correctIndex =
        dto.options.findIndex(
          (o) =>
            o.is_correct === true
        );

      const labels = [
        'A',
        'B',
        'C',
        'D',
        'E',
      ];

      if (
        correctIndex >= 0
      ) {
        answerKey =
          labels[
            correctIndex
          ];
      }
    }

    console.log(
      '=== ANSWER KEY ==='
    );
    console.log(answerKey);

    console.log(
      '=== OPTIONS ==='
    );
    console.dir(
      dto.options,
      { depth: null }
    );

    console.log(
      '=== AUDIO ==='
    );
    console.log(
      answerAudioPath
    );

    const qData: any = {
      test_id:
        dto.test_id,

      question_type:
        dto.question_type,

      question_text:
        dto.question_text,

      question_image:
  this.normalizePath(
    questionImagePath ??
    dto.question_image ??
    null
  ),

      answer_audio:
  this.normalizePath(
    answerAudioPath ??
    null
  ),

      answer_key:
        answerKey,

      score: dto.score,

      sort_order:
        dto.sort_order,

      is_active:
        dto.is_active,

      options:
        dto.options,
    };

    const question =
      await questionRepo.create(
        qData
      );

    if (
      dto.question_type ===
        QuestionType.MULTIPLE_CHOICE &&
      dto.options
    ) {
      for (const opt of dto.options) {

  await optionRepo.create({
    ...opt,

    option_image:
      this.normalizePath(
        opt.option_image
      ),

    question_id:
      question.id,
  });

}
    }

    return this.getById(
      question.id
    );
  }

  async update(
  id: string,
  dto: UpdateQuestionDTO,
  questionImagePath?: string,
  answerAudioPath?: string
): Promise<Question> {

  const existing =
    await questionRepo.findById(
      id
    );

  if (!existing) {
    throw new NotFoundError(
      'Question not found'
    );
  }

  const updateData: any = {
    ...dto,
  };

  if (
    questionImagePath
  ) {
    updateData.question_image =
      questionImagePath;
  }

  if (
    answerAudioPath
  ) {
    updateData.answer_audio =
      answerAudioPath;
  }

  // update tabel questions
  await questionRepo.update(
    id,
    updateData
  );

  // =========================
  // UPDATE OPTIONS
  // =========================
  if (
    dto.question_type ===
      QuestionType.MULTIPLE_CHOICE &&
    dto.options
  ) {

    const oldOptions =
      await optionRepo.findByQuestionId(
        id
      );

    // hapus opsi lama
    for (const old of oldOptions) {
      if (old.id) {
        await optionRepo.delete(
          old.id
        );
      }
    }

    // simpan opsi baru
    for (const opt of dto.options) {
      await optionRepo.create({
        ...opt,
        question_id: id,
      });
    }

    // update answer key otomatis
    const correctIndex =
      dto.options.findIndex(
        (o) =>
          o.is_correct === true
      );

    const labels = [
      'A',
      'B',
      'C',
      'D',
      'E',
    ];

    if (
      correctIndex >= 0
    ) {
      await questionRepo.update(
        id,
        {
          answer_key:
            labels[
              correctIndex
            ],
        }
      );
    }
  }

  return this.getById(
    id
  );
}

  async delete(
    id: string
  ): Promise<void> {
    const q =
      await questionRepo.findById(
        id
      );

    if (!q) {
      throw new NotFoundError(
        'Question not found'
      );
    }

    await questionRepo.delete(id);
  }

  async duplicate(
    id: string,
    newTestId?: string
  ): Promise<Question> {
    const q =
      await questionRepo.findById(
        id
      );

    if (!q) {
      throw new NotFoundError(
        'Question not found'
      );
    }

    const newQ =
      await questionRepo.duplicate(
        id,
        newTestId
      );

    return this.getById(
      newQ.id
    );
  }
  private normalizePath(
  filePath?: string | null
) {
  if (!filePath) return null;

  return filePath
    .replace(process.cwd(), '')
    .replace(/\\/g, '/')
    .replace(/^\/+/, '');
}
}