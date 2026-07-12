import { Router } from 'express';
import testRouter from '../test/routes/test.routes';

const router = Router();

router.use('/test', testRouter);

export default router;