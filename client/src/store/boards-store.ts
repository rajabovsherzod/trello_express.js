import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Board, List, Card } from '@/types/index';
import { getBoards } from '@/api/get-boards';

interface BoardsStore {
  boards: Board[];
  isLoading: boolean;
  error: string | null;
  fetchBoards: () => Promise<void>;
  // Board CRUD
  addBoard: (board: Board) => void;
  updateBoard: (id: string, board: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  setBoards: (boards: Board[]) => void;
  setError: (error: string | null) => void;
  getBoardById: (boardId: string) => Board | undefined;
  getBoardLists: (boardId: string) => List[];
  getBoardCards: (boardId: string, listId: string) => Card[];
  // List CRUD
  addList: (boardId: string, list: List) => void;
  updateList: (boardId: string, list: Partial<List>) => void;
  deleteList: (boardId: string, listId: string) => void;
  // Card CRUD
  addCard: (boardId: string, listId: string, card: Card) => void;
  updateCard: (boardId: string, listId: string, card: Partial<Card>) => void;
  deleteCard: (boardId: string, listId: string, cardId: string) => void;
}

export const useBoardsStore = create<BoardsStore>()(
  persist(
    (set, get) => ({
      boards: [],
      isLoading: true, // Sahifa ochilganda yuklanishni boshlaymiz
      error: null,
      fetchBoards: async () => {
        set({ isLoading: true, error: null });
        try {
          const boards = await getBoards();
          set({ boards, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },
      // Board CRUD
      addBoard: (board) =>
        set((state) => ({
          boards: [...state.boards, board],
        })),
      updateBoard: (id, board) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b._id === id ? { ...b, ...board } : b
          ),
        })),
      deleteBoard: (id) =>
        set((state) => ({
          boards: state.boards.filter((b) => b._id !== id),
        })),
      setBoards: (boards) => set({ boards, isLoading: false, error: null }),
      setError: (error) => set({ error, isLoading: false }),
      // Getters
      getBoardById: (boardId) => get().boards.find((b) => b._id === boardId),
      getBoardLists: (boardId) => {
        const board = get().boards.find((b) => b._id === boardId);
        return board ? board.lists || [] : [];
      },
      getBoardCards: (boardId, listId) => {
        const board = get().boards.find((b) => b._id === boardId);
        if (!board) return [];
        const list = (board.lists || []).find((l) => l._id === listId);
        return list ? list.cards : [];
      },
      // List CRUD
      addList: (boardId, list) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b._id === boardId ? { ...b, lists: [...(b.lists || []), list] } : b
          ),
        })),
      updateList: (boardId, listUpdate) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b._id === boardId
              ? {
                  ...b,
                  lists: (b.lists || []).map((l) =>
                    l._id === listUpdate._id ? { ...l, ...listUpdate } : l
                  ),
                }
              : b
          ),
        })),
      deleteList: (boardId, listId) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b._id === boardId
              ? { ...b, lists: (b.lists || []).filter((l) => l._id !== listId) }
              : b
          ),
        })),
      // Card CRUD
      addCard: (boardId, listId, card) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b._id === boardId
              ? {
                  ...b,
                  lists: (b.lists || []).map((l) =>
                    l._id === listId ? { ...l, cards: [...l.cards, card] } : l
                  ),
                }
              : b
          ),
        })),
      updateCard: (boardId, listId, cardUpdate) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b._id === boardId
              ? {
                  ...b,
                  lists: (b.lists || []).map((l) =>
                    l._id === listId
                      ? {
                          ...l,
                          cards: l.cards.map((c) =>
                            c._id === cardUpdate._id ? { ...c, ...cardUpdate } : c
                          ),
                        }
                      : l
                  ),
                }
              : b
          ),
        })),
      deleteCard: (boardId, listId, cardId) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b._id === boardId
              ? {
                  ...b,
                  lists: (b.lists || []).map((l) =>
                    l._id === listId
                      ? { ...l, cards: l.cards.filter((c) => c._id !== cardId) }
                      : l
                  ),
                }
              : b
          ),
        })),
    }),
    {
      name: 'boards-storage',
      partialize: (state) => ({ boards: state.boards }), 
    }
  )
);