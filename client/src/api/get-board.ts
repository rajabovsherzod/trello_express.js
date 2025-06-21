import { $api as axios } from './axios';
import type { Board } from '@/types';

// Backenddan keladigan javobning to'liq tipini belgilaymiz
interface GetBoardResponse {
  message: string;
  data: Board;
}

export const getBoardById = async (boardId: string): Promise<Board> => {
  const { data } = await axios.get<GetBoardResponse>(`/boards/${boardId}`);
  // Komponentga faqat doska ma'lumotlarini qaytaramiz
  return data.data;
}; 