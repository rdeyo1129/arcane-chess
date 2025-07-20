import { Router } from 'express';
import passport from '../config/passport.js';
import * as categoryCtrl from '../controllers/categoryController.js';
import validate from '../middleware/validate.js';
import authorize from '../middleware/authorize.js';

const router = Router();

// Public
router.get('/', categoryCtrl.listCategories);
router.get('/:id', categoryCtrl.getCategoryById);

// Protected
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorize(['user', 'moderator', 'admin']),
  validate('createCategory'),
  categoryCtrl.createCategory
);
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['moderator', 'admin']),
  validate('updateCategory'),
  categoryCtrl.updateCategory
);
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['moderator', 'admin']),
  categoryCtrl.deleteCategory
);

export default router;
