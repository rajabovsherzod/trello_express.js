import ApiError from "../../utils/api.error.js";
import CardModel from "./card.model.js";
import ListModel from "../lists/list.model.js";
import BoardModel from "../boards/board.model.js";
import mongoose from "mongoose";

class CardService{
    async createCard(listId, userId, cardData){
        const { name } = cardData
        if(!name || !name.trim()){
            throw new ApiError(400, 'Card name is required')
        }

        const list = await ListModel.findById(listId)
        if(!list){
            throw new ApiError(404, 'List not found')
        }

        const board = await BoardModel.findById(list.boardId)
        if(!board){
            throw new ApiError(404, 'Associated board not found')
        }
        
        if(!board.members.includes(userId)){
            throw new ApiError(403, 'Forbidden: You are not a member of this board');
        }

        const cardCountList = await CardModel.countDocuments({ listId })
        const position = cardCountList

        const newCard = await CardModel.create({
            name: name.trim(),
            description: cardData.description || '',
            listId,
            boardId: list.boardId,
            position,
            createdBy: userId,
            updatedBy: userId
        })

        return newCard
    }

    async getAllCardsForList(listId, userId){
        const list = await ListModel.findById(listId)
        if(!list){
            throw new ApiError(404, 'List not found')
        }

        const board = await BoardModel.findById(list.boardId)
        if(!board){
            throw new ApiError(404, 'Associated board not found')
        }

        if(!board.members.includes(userId)){
            throw new ApiError(403, 'Forbidden: You are not a member of this board')
        }

        const allCards = await CardModel.find({ listId })
        return allCards
    }

    async getCardById(cardId, userId){
        const card = await CardModel.findById(cardId)
        if(!card){
            throw new ApiError(404, 'Card not found')
        }

        const board = await BoardModel.findById(card.boardId)
        if(!board){
            throw new ApiError(404, 'Associated board not found')
        }
        if(!board.members.includes(userId)){
            throw new ApiError(403, 'Forbidden: You are not a member of this board')
        }

        return card
    }

    async updateCard(cardId, userId, cardData){
        const card = await CardModel.findById(cardId)
        if(!card){
            throw new ApiError(404, 'Card not found')
        }

        const board = await BoardModel.findById(card.boardId)

        if (!board) {
            throw new ApiError(404, 'Associated board not found');
        }

        if(!board.members.includes(userId)){
            throw new ApiError(403, 'Forbidden: You are not a member of this board, you cannot update this card')
        }


        if (cardData.hasOwnProperty('name')) {
            if (cardData.name === null || cardData.name.trim() === '') {
                throw new ApiError(400, 'Card name cannot be empty');
            }
            card.name = cardData.name.trim();
        }

        if (cardData.hasOwnProperty('description')) {
            card.description = cardData.description;
        }
        
        card.updatedBy = userId

        const updatedCard = await card.save()

        return updatedCard
    }

    async deleteCard(cardId, userId){

        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const card = await CardModel.findById(cardId).session(session)
            if(!card){
                throw new ApiError(404, 'Card not found')
            }

            const board = await BoardModel.findById(card.boardId).session(session)

            if(!board){
                throw new ApiError(404, 'Associated board not found')
            }

            if(!board.members.includes(userId)){
                throw new ApiError(403, 'Forbidden: You are not a member of this board, you cannot delete this card')
            }

            await CardModel.findByIdAndDelete(cardId).session(session)
            
            await CardModel.updateMany(
                {
                    listId: card.listId,
                    position: { $gt: card.position }
                },
                {
                    $inc: { position: -1 }
                }
            ).session(session)

            await session.commitTransaction()
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
    }


    async reorderCardsInList(listId, orderedCardIds, userId){
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

        const operations = orderedCardIds.map((cardId, idx) => {
            return {
                updateOne: {
                    filter: { _id: cardId, listId: listId},
                    update: { $set: { position: idx }}
                }
            }
        })

        try {
            if(operations.length === 0){
                return
            }
            await CardModel.bulkWrite(operations)
        } catch (error) {
            throw new ApiError(500, 'Failed to reorder cards')
        }
    }
}

export default new CardService()