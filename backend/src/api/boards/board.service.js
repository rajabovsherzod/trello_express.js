import BoardModel from "./board.model.js";
import ApiError from "../../utils/api.error.js";
import ListModel from "../lists/list.model.js";
import CardModel from "../cards/card.model.js";
import mongoose from "mongoose";

class BoardService {
    async createBoard(boardData, userId){
        const boardPayload = {
            ...boardData,
            owner: userId,
            members: [userId]
        };
        const newBoard = await BoardModel.create(boardPayload);
        return newBoard;
    }

    async getBoardsForUser(userId, queryOptions = {}){
        if(!userId){
            throw new ApiError(400, 'User id is required')
        }

        const page = parseInt(queryOptions.page, 10) || 1
        const limit = parseInt(queryOptions.limit, 10) || 10

        const skip = (page - 1) * limit

        const [boards, totalBoards] = await Promise.all([
            BoardModel.find({members: userId}).sort({createdAt: -1}).skip(skip).limit(limit),
            BoardModel.countDocuments({members: userId})
        ])

        const totalPages = Math.ceil(totalBoards/limit)

        return {
            boards,
            pagination: {
                totalBoards,
                totalPages,
                currentPage: page,
                limit
            }
        }
    }

    async getBoardById(boardId, userId){
        const board = await BoardModel.findById(boardId)

        if(!board){
            throw new ApiError(404, 'Board not found')
        }

        if(!board.members.includes(userId)){
            throw new ApiError(403, 'Forbidden: You are not a member of this board')
        }

        const lists = await ListModel.find({ boardId: boardId}).sort({ position: 'asc'}).lean()
        const cards = await CardModel.find({ boardId: boardId}).sort({ position: 'asc'}).lean()

        lists.forEach(list => {
            list.cards = cards.filter(card => card.listId.toString() === list._id.toString())
        })

        const result = {
            ...board.toObject(),
            lists
        }

        return result
    }

    async updateBoard(boardId, userId, boardData){
        const board = await BoardModel.findById(boardId)

        if(!board){
            throw new ApiError(404, 'Board not found')
        }

        const isOwner = board.owner.equals(userId)

        if(!isOwner){
            throw new ApiError(403, 'You do not have permission to update this board')
        }

        delete boardData.owner
        delete boardData.members

        return BoardModel.findByIdAndUpdate(boardId, boardData, {new: true})
    }

    async deleteBoard(boardId, userId){
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const board = await BoardModel.findById(boardId).session(session)

            if(!board){
                throw new ApiError(404, 'Board not found')
            }

            if(!board.owner.equals(userId)){
                throw new ApiError(403, 'Forbidden: Only the board owner can delete this board');
            }

            await CardModel.deleteMany({ boardId }).session(session)
            await ListModel.deleteMany({ boardId }).session(session)

            await BoardModel.findByIdAndDelete(boardId).session(session)
            
            await session.commitTransaction()
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally{
            session.endSession()
        }
    }
}

export default new BoardService()