import { Router } from 'express';
import passport from '../config/passport.js';
import * as threadCtrl from '../controllers/threadController.js';
import validate from '../middleware/validate.js';

const router = Router();

// Public endpoints
router.get('/', threadCtrl.listThreads);
router.get('/:id', threadCtrl.getThreadById);

// Protected write endpoints
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  validate('createThread'),
  threadCtrl.createThread
);

router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validate('updateThread'),
  threadCtrl.updateThread
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  threadCtrl.deleteThread
);

export default router;
