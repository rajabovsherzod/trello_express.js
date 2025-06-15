import listService from "./list.service.js"
class ListController {
    constructor(listService){
        this.listService = listService
    }

    createList = async (req, res, next) => {
        try {
            const { boardId } = req.params
            const userId = req.user.id
            const listData = req.body
            const data = await this.listService.createList(boardId, userId, listData)
            res.status(201).json({
                message: 'List created successfully',
                data
            })
        } catch (error) {
            next(error)
        }
    }

    getAllListsForBoard = async (req, res, next) => {
        try {
            const { boardId } = req.params
            const userId = req.user.id

            const data = await this.listService.getAllListsForBoard(boardId, userId)
            res.status(200).json({
                message: 'Lists fetched successfully',
                data
            })
        } catch (error) {
            next(error)
        }
    }

    getListById = async (req, res, next) => {
        try {
            const { listId } = req.params
            const userId = req.user.id
            const data = await this.listService.getListById(listId, userId)
            res.status(200).json({
                message: 'List fetched successfully',
                data
            })
        } catch (error) {
            next(error)
        }
    }

    updateList = async (req, res, next) => {
        try {
            const listId = req.params.listId
            const userId = req.user.id
            const listData = req.body

            const data = await this.listService.updateList(listId, listData, userId)
            res.status(200).json({
                message: 'List updated successfully',
                data
            })
        } catch (error) {
            next(error)
        }
    }

    deleteList = async (req, res, next) => {
        try {
            const { listId } = req.params
            const userId = req.user.id
            await this.listService.deleteList(listId, userId)
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }

    reorderLists = async (req, res, next) => {
        try {
            const { boardId } = req.params
            const userId = req.user.id
            const { orderListIds } = req.body

            await this.listService.reorderLists(boardId, userId, orderListIds)
            res.status(200).json({
                message: 'Lists reordered successfully'
            })
        } catch (error) {
            next(error)
        }
    }
    
}

export default new ListController(listService)