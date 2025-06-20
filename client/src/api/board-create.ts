// client/src/api/board-create.ts
import { type BoardCreateValues } from "@/lib/board-create-validation"; // Nomni to'g'rilaymiz
import { $api } from "./axios";  // Yagona standart nomni ishlatamiz
import type { Board } from "@/types";

export const createBoard = async (boardData: BoardCreateValues): Promise<Board> => {
    try {
        const { data } = await $api.post<{ message: string, data: Board }>('/boards', boardData);
        return data.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to create board. Please try again.';
        throw new Error(errorMessage);
    }
};