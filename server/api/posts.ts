import { Router } from 'express';
import passport from '../config/passport.js';
import * as postCtrl from '../controllers/postController.js';
import validate from '../middleware/validate.js';
import authorize from '../middleware/authorize.js';
import validateQuery from '../middleware/validateQuery.js';

const router = Router();

// Public: list all posts in a thread
router.get('/:threadId', validateQuery, postCtrl.listPostsByThread);

// Protected: create a new post/reply
router.post(
  '/:threadId',
  passport.authenticate('jwt', { session: false }),
  authorize(['user', 'moderator', 'admin']),
  validate('createPost'),
  postCtrl.createPost
);

// Protected: soft-delete a post
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['moderator', 'admin']),
  postCtrl.deletePost
);

router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['user', 'moderator', 'admin']),
  validate('updatePost'),
  postCtrl.updatePost
);

export default router;
