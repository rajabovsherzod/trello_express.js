import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import CardController from "./card.controller.js";
import cardController from "./card.controller.js";

const router = Router()

router.put('/:cardId', authMiddleware, CardController.updateCard)
router.delete('/:cardId', authMiddleware, CardController.deleteCard)
router.get('/:cardId', authMiddleware, cardController.getCardById)
router.patch('/:cardId/move', authMiddleware, cardController.moveCard)

export default router 