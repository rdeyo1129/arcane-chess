import { Router } from 'express';
import passport from '../config/passport.js';
import authorize from '../middleware/authorize.js';
import * as threadCtrl from '../controllers/threadController.js';
import validate from '../middleware/validate.js';

const router = Router();

// Public reads
router.get('/', threadCtrl.listThreads);
router.get('/:id', threadCtrl.getThreadById);

// Creation: any logged-in user
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorize(['user', 'moderator', 'admin']),
  validate('createThread'),
  threadCtrl.createThread
);

// Editing: authors + mods/admins
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['user', 'moderator', 'admin']),
  validate('updateThread'),
  threadCtrl.updateThread
);

// Deletion (soft-delete): authors + mods/admins
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['user', 'moderator', 'admin']),
  threadCtrl.deleteThread
);

export default router;
