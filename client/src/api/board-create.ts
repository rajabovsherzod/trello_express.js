// client/src/api/board-create.ts
import { type BoardCreateSheetValues } from "@/lib/board-create-validation";
import { $api } from "./axios";  // $api ni import qilamiz

export const createBoard = async (boardData: BoardCreateSheetValues) => {
    try {
        const { data } = await $api.post('/boards', boardData);
        return data;
    } catch (error) {
        throw error;
    }
};