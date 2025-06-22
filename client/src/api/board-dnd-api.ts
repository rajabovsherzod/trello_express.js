import { $api } from "./axios"
import type { Card } from "@/types"

interface ReorderListsPayload {
    boardId: string,
    lists: { _id: string, position: number }[]
}

export const reorderLists = async (payload: ReorderListsPayload): Promise<void> => {
    const { boardId, lists } = payload
    await $api.patch(`/boards/${boardId}/lists/reorder`, { lists })
}

interface ReorderCardsPayload {
    listId: string,
    cards: { _id: string, position: number }[]
}

export const reorderCards = async (payload: ReorderCardsPayload): Promise<void> => {
    const { listId, cards } = payload
    await $api.patch(`/lists/${listId}/cards/reorder`, { cards })
}


interface MoveCardPayload {
    cardId: string
    newListId: string
    newPosition: number
}

export const moveCard = async (payload: MoveCardPayload): Promise<Card> => {
    const { cardId, newListId, newPosition } = payload
    const { data } = await $api.patch(`/cards/${cardId}/move`, { newListId, newPosition}) 
    return data.data
}