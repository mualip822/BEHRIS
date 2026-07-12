import { Router } from 'express';
import { authenticate } from '../../../../core/middlewares/auth.middleware';
import { CandidateTestController } from '../controllers/candidateTest.controller';

const router = Router();
const ctrl = new CandidateTestController();

router.get('/tests', authenticate, ctrl.getAssignments.bind(ctrl));
router.get('/tests/:testId', authenticate, ctrl.getTestById.bind(ctrl));
router.get('/tests/:testId/questions', authenticate, ctrl.getQuestionsByTestId.bind(ctrl));
router.get('/messages/:messageId/assignment', authenticate, ctrl.getAssignmentByMessage.bind(ctrl));
router.get('/attempts/:attemptId', authenticate, ctrl.getAttemptById.bind(ctrl));
router.get('/attempts/:attemptId/questions', authenticate, ctrl.getAttemptQuestions.bind(ctrl));
router.get('/attempts/:attemptId/score', authenticate, ctrl.getAttemptScore.bind(ctrl));

export default router;