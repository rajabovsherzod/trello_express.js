import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import BoardController from "./board.controller.js";
import ListController from "../lists/list.controller.js";

const router = Router()

router.post('/', authMiddleware, BoardController.create)
router.get('/', authMiddleware, BoardController.getBoardsForUser)
router.get('/:id', authMiddleware, BoardController.getBoardById)
router.put('/:id', authMiddleware, BoardController.updateBoard)
router.delete('/:id', authMiddleware, BoardController.deleteBoard)

// Nested route for lists within a board
// POST /api/boards/:boardId/lists
router.post('/:boardId/lists', authMiddleware, ListController.createList);
router.get('/:boardId/lists', authMiddleware, ListController.getAllListsForBoard);
router.patch('/:boardId/lists/reorder', authMiddleware, ListController.reorderLists);

export default router