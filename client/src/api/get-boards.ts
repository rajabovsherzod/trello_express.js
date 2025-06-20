import { $api } from './axios';
import type { Board } from '@/types/index';

interface GetBoardsResponse {
    message: string;
    data: {
        boards: Board[];
        pagination: any; 
    }
}

export const getBoards = async (): Promise<Board[]> => {
  try {
    const { data } = await $api.get<GetBoardsResponse>('/boards');
    return data.data.boards;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch boards');
  }
};