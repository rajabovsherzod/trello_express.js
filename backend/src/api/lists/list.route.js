import { Router } from 'express';
import authMiddleware from '../../middlewares/auth.middleware.js';
import ListController from './list.controller.js';
import cardController from '../cards/card.controller.js';

const router = Router();

router.put('/:listId', authMiddleware, ListController.updateList);
router.delete('/:listId', authMiddleware, ListController.deleteList);
router.get('/:listId', authMiddleware, ListController.getListById);

router.post('/:listId/cards', authMiddleware, cardController.createCard);
router.get('/:listId/cards', authMiddleware, cardController.getAllCardsForList);
router.patch('/:listId/cards/reorder', authMiddleware, cardController.reorderCardsInList)

export default router;