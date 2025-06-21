import { $api } from "./axios";
import type { Card } from "@/types";

interface CreateCardPayload {
    listId: string;
    name: string;
}

interface CreateCardResponse {
    message: string;
    data: Card;
}

export const createCard = async ({ listId, name }: CreateCardPayload): Promise<Card> => {
    const { data } = await $api.post<CreateCardResponse>(`/lists/${listId}/cards`, { name });
    return data.data;
}