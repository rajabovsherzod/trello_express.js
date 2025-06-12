import ListModel from './list.model.js'
import BoardModel from '../boards/board.model.js'
import ApiError from '../../utils/api.error.js'

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

        const newList = await ListModel.create({name: name.trim(), boardId, createdBy: userId, updatedBy: userId})
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
        return {
            list: updatedList
        }
    }

    async deleteList(listId, userId){
        if(!listId){
            throw new ApiError(400, 'List id is required')
        }

        const list = await ListModel.findById(listId)
        if(!list){
            throw new ApiError(404, 'List not found')
        }
        const board = await BoardModel.findById(list.boardId)
        if(!board.owner.equals(userId)){
            throw new ApiError(403, 'Forbidden: You are not the owner of this board, you cannot delete this list')
        }

        await ListModel.findByIdAndDelete(listId)
        return 
    }
} 

export default new ListService()