import { $api as axios } from './axios';
import type { Board } from '@/types';

interface GetBoardsResponse {
    message: string;
    data: {
        boards: Board[];
        pagination: any; 
    }
}

export const getBoards = async (): Promise<Board[]> => {
  const { data } = await axios.get<GetBoardsResponse>('/boards');
  return data.data.boards;
};