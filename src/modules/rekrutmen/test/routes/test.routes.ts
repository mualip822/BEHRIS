import { Router } from 'express';
import {
  authenticate,
  hrOnly,
} from '../../../../core/middlewares/auth.middleware';

import { TestController } from '../controllers/test.controller';
import { QuestionController } from '../controllers/question.controller';
import { OptionController } from '../controllers/option.controller';
import { AttemptController } from '../controllers/attempt.controller';
import { AnswerController } from '../controllers/answer.controller';

const router = Router();

const testCtrl = new TestController();
const questionCtrl = new QuestionController();
const optionCtrl = new OptionController();
const attemptCtrl = new AttemptController();
const answerCtrl = new AnswerController();

// =====================================
// QUESTIONS
// =====================================

router.get(
  '/questions',
  authenticate,
  hrOnly,
  questionCtrl.list.bind(questionCtrl)
);

router.post(
  '/questions',
  authenticate,
  hrOnly,
  questionCtrl.create.bind(questionCtrl)
);

router.get(
  '/questions/:id',
  authenticate,
  hrOnly,
  questionCtrl.getById.bind(questionCtrl)
);

router.put(
  '/questions/:id',
  authenticate,
  hrOnly,
  questionCtrl.update.bind(questionCtrl)
);

router.delete(
  '/questions/:id',
  authenticate,
  hrOnly,
  questionCtrl.delete.bind(questionCtrl)
);

router.post(
  '/questions/:id/duplicate',
  authenticate,
  hrOnly,
  questionCtrl.duplicate.bind(questionCtrl)
);

// =====================================
// OPTIONS
// =====================================

router.post(
  '/options',
  authenticate,
  hrOnly,
  optionCtrl.create.bind(optionCtrl)
);

router.put(
  '/options/:id',
  authenticate,
  hrOnly,
  optionCtrl.update.bind(optionCtrl)
);

router.delete(
  '/options/:id',
  authenticate,
  hrOnly,
  optionCtrl.delete.bind(optionCtrl)
);

// =====================================
// ATTEMPTS
// =====================================

router.post(
  '/start',
  authenticate,
  attemptCtrl.start.bind(attemptCtrl)
);

router.post(
  '/submit',
  authenticate,
  attemptCtrl.submit.bind(attemptCtrl)
);

// =====================================
// ANSWERS
// =====================================

router.post(
  '/answer',
  authenticate,
  answerCtrl.save.bind(answerCtrl)
);

router.post(
  '/answer/audio',
  authenticate,
  answerCtrl.saveAudio.bind(answerCtrl)
);

// =====================================
// TESTS
// =====================================

// HARUS sebelum "/:id"
router.get(
  '/active',
  authenticate,
  hrOnly,
  testCtrl.getActiveTests.bind(testCtrl)
);

router.get(
  '/',
  authenticate,
  hrOnly,
  testCtrl.list.bind(testCtrl)
);

router.post(
  '/',
  authenticate,
  hrOnly,
  testCtrl.create.bind(testCtrl)
);

router.get(
  '/:id',
  authenticate,
  hrOnly,
  testCtrl.getById.bind(testCtrl)
);

router.put(
  '/:id',
  authenticate,
  hrOnly,
  testCtrl.update.bind(testCtrl)
);

router.delete(
  '/:id',
  authenticate,
  hrOnly,
  testCtrl.delete.bind(testCtrl)
);

export default router;