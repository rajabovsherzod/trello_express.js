import { Router } from 'express';
import authMiddleware from '../../middlewares/auth.middleware.js';
import ListController from './list.controller.js';

const router = Router();

// The POST route for creating a list is in `board.route.js` because it's nested.
// These routes below handle operations on a single list.

// GET /api/lists/:listId
// router.get('/:listId', authMiddleware, ListController.getListById);

// PUT /api/lists/:listId
router.put('/:listId', authMiddleware, ListController.updateList);
router.delete('/:listId', authMiddleware, ListController.deleteList);

export default router;