import ApiError from "../../utils/api.error.js";
import boardService from "./board.service.js";
class BoardController {
    constructor(boardService){
        this.boardService = boardService
    }

    create = async (req, res, next) => {
        try {
            const userId = req.user.id
            const boardData = req.body
            const newBoard = await boardService.createBoard(boardData, userId)
            res.status(201).json({
                message: 'Board created successfully',
                board: newBoard
            })
        } catch (error) {
            next(error)
        }
    }

    getBoardsForUser = async (req, res, next) => {
        try {
            const userId= req.user.id
            const queryOptions = req.query
            const boards = await boardService.getBoardsForUser(userId, queryOptions)
            res.status(200).json({
                message: 'Boards fetched successfully',
                data: boards
            })
        } catch (error) {
            next(error)
        }
    }

    getBoardById = async (req, res, next) => {
        try {
            const userId = req.user.id
            const boardId = req.params.id

            const boardData = await boardService.getBoardById(boardId, userId)

            res.status(200).json({
                message: 'Board fetched successfully',
                data: boardData
            })
        } catch (error) {
            next(error)
        }
    }

    updateBoard = async (req, res, next) => {
        try {
            const boardId = req.params.id
            const userId = req.user.id
            const boardData =req.body

            const updatedBoard = await boardService.updateBoard(boardId, userId, boardData)
            res.status(200).json({
                message: 'Board updated successfully',
                data: updatedBoard
            })
        } catch (error) {
            next(error)
        }
    }

    deleteBoard = async (req, res, next) => {
        try {
            const boardId = req.params.id
            const userId = req.user.id

            await boardService.deleteBoard(boardId, userId)
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}


export default new BoardController(boardService)