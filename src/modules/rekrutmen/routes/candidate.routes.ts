import { Router } from 'express';
import { candidateController } from '../controllers/candidate.controller';
import { messageController } from '../controllers/message.controller';
import { authMiddleware } from '../../../core/middlewares/auth.middleware';
import { roleMiddleware } from '../../../core/middlewares/role.middleware';

const router = Router();

// ======= ADMIN & HR =======
router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'hr', 'rekrutmen_admin']));

// =====================================
// CANDIDATE
// =====================================

router.get(
  '/',
  candidateController.getCandidates.bind(candidateController)
);

router.get(
  '/:id',
  candidateController.getCandidateDetail.bind(candidateController)
);

router.patch(
  '/:id/status',
  candidateController.updateStatus.bind(candidateController)
);

router.post(
  '/:id/invite',
  candidateController.inviteCandidate.bind(candidateController)
);

// =====================================
// MESSAGE
// =====================================

router.post(
  '/:id/messages',
  messageController.sendMessage.bind(messageController)
);

router.get(
  '/:id/messages',
  messageController.getMessagesByApply.bind(messageController)
);

// =====================================
// TEST ASSIGNMENT
// =====================================

router.post(
  '/:id/send-test',
  messageController.sendTestMessage.bind(messageController)
);

export default router;