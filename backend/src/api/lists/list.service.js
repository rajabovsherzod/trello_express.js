import ListModel from './list.model.js'
import BoardModel from '../boards/board.model.js'
import ApiError from '../../utils/api.error.js'
import mongoose from 'mongoose'
import CardModel from '../cards/card.model.js'

class ListService {
    async createList(boardId, userId, listData){
        const board = await BoardModel.findById(boardId)
        if(!board){
            throw new ApiError(404, 'Board not found')
        }

        if(!board.members.includes(userId)){
            throw new ApiError(403, 'Forbidden: You are not a member of this board')
        }

        const { name } = listData

        if(!name || !name.trim()){
            throw new ApiError(400, 'List name is required')
        }
        const listCountInBoard = await ListModel.countDocuments({ boardId: boardId })
        const position = listCountInBoard

        const newList = await ListModel.create({
            name: name.trim(), 
            boardId, 
            position: position,
            createdBy: userId, 
            updatedBy: userId})
        return newList
    }

    async getAllListsForBoard(boardId, userId){
        const board = await BoardModel.findById(boardId)
        if(!board){
            throw new ApiError(404, 'Board not found')
        }

        if(!board.members.includes(userId)){
            throw new ApiError(403, 'Forbidden: You are not a member of this board')
        }

        const allLists = await ListModel.find({boardId}).sort({createdAt: -1})
        return {
            board: {
                _id: board._id,
                name: board.name
            },
            lists: allLists
        }
    }

    async getListById(listId, userId){
        const list = await ListModel.findById(listId)
        if(!list){
            throw new ApiError(404, 'List not found')
        }

        const board = await BoardModel.findById(list.boardId)
        if(!board){
            throw new ApiError(404, 'Board not found')
        }
        if(!board.members.includes(userId)){
            throw new ApiError(403, 'Forbidden: You are not a member of this board')
        }

        return list
    }

    async updateList(listId, listData, userId){
        const list = await ListModel.findById(listId)
        if(!list){
            throw new ApiError(404, 'List not found')
        }
        if(!listData.name || !listData.name.trim()){
            throw new ApiError(400, 'List name cannot be empty')
        }

        const board = await BoardModel.findById(list.boardId)
        if(!board){
            throw new ApiError(404, 'Board not found')
        }

        if(!board.members.includes(userId)){
            throw new ApiError(403, 'Forbidden: You are not a member of this board')
        }

        list.name = listData.name.trim()
        list.updatedBy = userId
        const updatedList = await list.save()
        return updatedList
    }

    async deleteList(listId, userId){
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const list = await ListModel.findById(listId).session(session)
            if(!list){
                throw new ApiError(404, 'List not found')
            }
            const board = await BoardModel.findById(list.boardId).session(session)
            if (!board || !board.members.includes(userId)) {
                throw new ApiError(403, 'Forbidden: You are not a member of this board');
            }

            await ListModel.findByIdAndDelete(listId).session(session)
            await CardModel.deleteMany({ listId: listId }).session(session)

            await ListModel.updateMany(
                {
                    boardId: list.boardId,
                    position: { $gt: list.position }
                },
                {
                    $inc: { position: -1 }
                }
            ).session(session)

            await session.commitTransaction()
            return 
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
    }

    async reorderLists(boardId, userId, orderListIds){
        const board = await BoardModel.findById(boardId)
        if(!board){
            throw new ApiError(404, 'Board not found')
        }
        if(!board.members.includes(userId)){
            throw new ApiError(403, 'Forbidden: You are not a member of this board')
        }

        const operations  = orderListIds.map((listId, idx) => {
            return {
                updateOne: {
                    filter: { _id: listId, boardId: boardId },
                    update: { $set: {position: idx} },
                }
            }
        })

        try {
            if(operations.length === 0){
                return
            }
            await ListModel.bulkWrite(operations)
        } catch (error) {
            throw new ApiError(500, 'An error occurred while reordering lists')
        }
    }

} 

export default new ListService()