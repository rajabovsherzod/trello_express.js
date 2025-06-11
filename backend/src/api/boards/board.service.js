import BoardModel from "./board.model.js";
import ApiError from "../../utils/api.error.js";

class BoardService {
    async createBoard(boardData, userId){

        const newBoard = await BoardModel.create({...boardData, owner: userId})
        return newBoard
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

        const isMember = board.members.some(member => member.equals(userId))

        if(!isMember){
            throw new ApiError(403, 'You do not have permission to view this board')
        }

        return board
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
        const board = await BoardModel.findById(boardId)

        if(!board){
            throw new ApiError(404, 'Board not found')
        }

        const isOwner = board.owner.equals(userId)

        if(!isOwner){
            throw new ApiError(403, 'You do not have permission to delete this board')
        }

        await BoardModel.findByIdAndDelete(boardId)
        
        return 
    }
}

export default new BoardService()