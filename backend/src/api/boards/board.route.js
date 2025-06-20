import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import BoardController from "./board.controller.js";
import ListController from "../lists/list.controller.js";
import BoardService from "./board.service.js";

const router = Router()

// Controller instansini servis bilan birga yaratamiz
const boardController = new BoardController(BoardService)

// Barcha yo'nalishlar endi yaratilgan instansning metodlarini chaqiradi
router.post('/', authMiddleware, boardController.create)
router.get('/', authMiddleware, boardController.getBoardsForUser)
router.get('/:id', authMiddleware, boardController.getBoardById)
router.put('/:id', authMiddleware, boardController.updateBoard)
router.delete('/:id', authMiddleware, boardController.deleteBoard)

// Nested route for lists within a board
// POST /api/boards/:boardId/lists
router.post('/:boardId/lists', authMiddleware, ListController.createList);
router.get('/:boardId/lists', authMiddleware, ListController.getAllListsForBoard);
router.patch('/:boardId/lists/reorder', authMiddleware, ListController.reorderLists);

export default router