import cardService from "./card.service.js";

class CardController{
    constructor(cardService){
        this.cardService = cardService
    }

    createCard = async (req, res, next) => {
        try {
            const { listId } = req.params
            const userId = req.user.id
            const cardData = req.body

            const data = await this.cardService.createCard(listId, userId, cardData)
            res.status(201).json({
                message: 'Card created successfully',
                data
            })
        } catch (error) {
            next(error)
        }
    }

    getAllCardsForList = async (req, res, next) => {
        try {
            const { listId } = req.params
            const userId = req.user.id

            const data = await this.cardService.getAllCardsForList(listId, userId)
            res.status(200).json({
                message: 'All cards for list retrieved successfully',
                data
            })
        } catch (error) {
            next(error)
        }
    }

    getCardById = async (req, res, next) => {
        try {
            const { cardId } = req.params
            const userId = req.user.id

            const data = await this.cardService.getCardById(cardId, userId)
            res.status(200).json({
                message: 'Card retrieved successfully',
                data
            })
        } catch (error) {
            next(error)
        }
    }

    updateCard = async (req, res, next) => {
        try {
            const { cardId } = req.params
            const userId = req.user.id
            const cardData = req.body

            const data = await this.cardService.updateCard(cardId, userId, cardData)
            res.status(200).json({
                message: 'Card updated successfully',
                data
            })
        } catch (error) {
            next(error)
        }
    }

    deleteCard = async (req, res, next) => {
        try {
            const { cardId } = req.params
            const userId = req.user.id
            await this.cardService.deleteCard(cardId, userId)
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }

    // Reorder Cards

    reorderCardsInList = async (req, res, next) => {
        try {
            const { listId } = req.params
            const { cards } = req.body
            const userId = req.user.id

            await this.cardService.reorderCardsInList(listId, cards, userId)
            res.status(200).json({
                message: 'Cards reordered successfully'
            })
        } catch (error) {
            next(error)
        }
    }

    moveCard = async (req, res, next) => {
        try {
            const { cardId } = req.params
            const { newListId, newPosition } = req.body
            const userId = req.user.id

            await this.cardService.moveCard(cardId, newListId, newPosition, userId)
            res.status(200).json({
                message: 'Card moved successfully'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new CardController(cardService)