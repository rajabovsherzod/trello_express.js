import React, { useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

import { getBoardById } from '@/api/get-board';
import { createList } from '@/api/list-create';

import BoardHeader from '@/components/board/BoardHeader';
import MobileBoardHeader from '@/components/board/MobileBoardHeader';
import BoardMenu from '@/components/board/BoardMenu';
import ListComponent from '@/components/board/ListComponent';
import CardComponent from '@/components/board/CardComponent';
import { AddListForm } from '@/components/board/AddListForm';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import { useMediaQuery } from '@/hooks/use-media-query';

import type { List, Card, Board } from '@/types';

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const queryClient = useQueryClient();

  const [activeList, setActiveList] = useState<List | null>(null);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [previewBackground, setPreviewBackground] = useState<string | null>(null);
  const [isAddingList, setIsAddingList] = useState(false);
  
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const { data: boardData, isLoading, isError, error } = useQuery<Board, Error>({
    queryKey: ['board', boardId],
    queryFn: () => getBoardById(boardId!),
    enabled: !!boardId,
  });

  const { mutate: createListMutation, isPending: isCreatingList } = useMutation({
    mutationFn: createList,
    onSuccess: (newList) => {
      toast.success(`List "${newList.name}" created successfully!`);
      queryClient.setQueryData<Board | undefined>(['board', boardId], (oldData) => {
        if (!oldData) return undefined;
        return { ...oldData, lists: [...(oldData.lists || []), newList] };
      });
      setIsAddingList(false);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create list.');
    }
  });

  const listIds = useMemo(() => boardData?.lists?.map(l => l._id) ?? [], [boardData]);

  const onDragStart = useCallback((event: DragStartEvent) => {
    const type = event.active.data.current?.type;
    if (type === 'List') setActiveList(event.active.data.current?.item);
    if (type === 'Card') setActiveCard(event.active.data.current?.item);
  }, []);
  
  const onDragEnd = useCallback((event: DragEndEvent) => {
    setActiveList(null);
    setActiveCard(null);
  }, []);
  
  const handleAddList = (name: string) => {
    if (!boardId) return;
    createListMutation({ boardId, name });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0F172A]">
        <h1 className="text-2xl font-bold text-white">Loading your board...</h1>
      </div>
    );
  }

  if (isError) {
    return <div className="p-10 text-center text-xl text-red-500">Error: {error.message}</div>;
  }

  if (!boardData) {
     return <div className="p-10 text-center text-xl text-white">Board not found.</div>;
  }

  return (
    <SidebarProvider style={{ '--sidebar-width': isTablet ? '380px' : '400px' } as React.CSSProperties}>
      <div 
        className="flex h-screen w-full bg-cover bg-center"
        style={{
            transition: 'background 0.3s ease-in-out',
            ...( (previewBackground || boardData.background)?.startsWith('http')
              ? { backgroundImage: `url(${previewBackground || boardData.background})` }
              : { backgroundColor: previewBackground || boardData.background }
            ),
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative flex h-full flex-1 flex-col overflow-hidden md:mr-[var(--sidebar-width)]">
          
          <BoardHeader board={boardData} />
          <MobileBoardHeader board={boardData} />

          {/* Yangi "Sahifa Sarlavhasi" bloki, faqat mobil/planshet uchun */}
          <div className="lg:hidden p-4 pt-2">
              <h1 className="text-xl font-bold text-white [text-shadow:_0_1px_4px_rgb(0_0_0_/_50%)]">
                {boardData.name}
              </h1>
          </div>

          <main className="flex-grow overflow-y-auto px-4 pb-4">
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:h-full lg:items-start gap-6">
                
                {(boardData.lists && boardData.lists.length > 0) ? (
                  <SortableContext items={listIds}>
                    {(boardData.lists).map((list) => <ListComponent key={list._id} list={list} />)}
                  </SortableContext>
                ) : (
                  !isAddingList && (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-500 p-12 text-center w-full lg:w-96 bg-black/10">
                        <h3 className="text-xl font-semibold text-white">No lists yet!</h3>
                        <p className="mt-2 text-sm text-gray-400">
                            This board is empty. Create the first list to start organizing your tasks.
                        </p>
                    </div>
                  )
                )}

                <div className='flex-shrink-0 w-full lg:w-72'>
                  {isAddingList ? (
                    <AddListForm onAdd={handleAddList} onClose={() => setIsAddingList(false)} isSubmitting={isCreatingList} />
                  ) : (
                    <motion.button onClick={() => setIsAddingList(true)} layout className="flex w-full items-center gap-3 rounded-2xl p-4 text-teal-200 transition-all duration-300 border-2 border-dashed border-cyan-500/30 bg-teal-950/50 hover:bg-teal-950/70 hover:border-cyan-500/50">
                      <Plus size={20} />
                      <span className="font-medium">Add another list</span>
                    </motion.button>
                  )}
                </div>
              </div>
              <DragOverlay>
                {activeList ? <ListComponent list={activeList} isOverlay /> : null}
                {activeCard ? <CardComponent card={card} isOverlay /> : null}
              </DragOverlay>
            </DndContext>
          </main>
        </div>
        <Sidebar side="right">
          <BoardMenu board={boardData} setPreviewBackground={setPreviewBackground} />
        </Sidebar>
      </div>
    </SidebarProvider>
  );
};

export default BoardPage;