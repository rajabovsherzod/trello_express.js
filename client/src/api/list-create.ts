import { $api as axios } from './axios';
import type { List } from '@/types';

interface CreateListPayload {
    boardId: string,
    name: string
}

// Backenddan keladigan javobning to'liq tipini belgilaymiz
interface CreateListResponse {
    message: string;
    data: List;
}

export const createList = async ({ boardId, name }: CreateListPayload):Promise<List> => {
    const { data } = await axios.post<CreateListResponse>(`/boards/${boardId}/lists`, { name });
    return data.data;
}