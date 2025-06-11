import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import BoardController from "./board.controller.js";

const router = Router()

router.post('/', authMiddleware, BoardController.create)
router.get('/', authMiddleware, BoardController.getBoardsForUser)
router.get('/:id', authMiddleware, BoardController.getBoardById)
router.put('/:id', authMiddleware, BoardController.updateBoard)
router.delete('/:id', authMiddleware, BoardController.deleteBoard)

export default router