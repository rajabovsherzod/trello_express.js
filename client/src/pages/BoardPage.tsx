import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable';

import BoardHeader from '@/components/board/BoardHeader';
import { SidebarProvider, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import BoardMenu from '@/components/board/BoardMenu';
import { useMediaQuery } from '@/hooks/use-media-query';
import ListComponent from '@/components/board/ListComponent';
import CardComponent from '@/components/board/CardComponent';
import type { List } from '@/components/board/ListComponent';
import type { Card } from '@/components/board/CardComponent';


// Mock ma'lumotlar. Backend keyin ulanadi.
const mockBoard = {
  id: 'board-1',
  title: 'WOOOOOOW Project Board',
  description: 'The definitive plan for the WOOOOOOW project.',
  background: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop',
  members: [
    { id: '1', name: 'Alisher', avatar: 'https://i.pravatar.cc/40?u=alisher' },
    { id: '2', name: 'Diyor', avatar: 'https://i.pravatar.cc/40?u=diyor' },
    { id: '3', name: 'Zarina', avatar: 'https://i.pravatar.cc/40?u=zarina' },
  ],
  lists: [
    { id: 'list-1', title: 'Backlog', cards: [{ id: 'card-1', title: 'Setup database schema' }, { id: 'card-2', title: 'Implement JWT authentication' }, { id: 'card-7', title: 'Design the new logo' }] },
    { id: 'list-2', title: 'In Progress', cards: [{ id: 'card-3', title: 'Design the WOOOOOW PRO MAX header' }, {id: 'card-4', title: 'Develop the glassmorphism List component'}] },
    { id: 'list-3', title: 'Done', cards: [{ id: 'card-5', title: 'Fix the 404 error' }, {id: 'card-6', title: 'Integrate dynamic backgrounds'}] },
  ]
};


const BoardPageContent = () => {
  const [boardData, setBoardData] = useState(mockBoard);
  const [activeList, setActiveList] = useState<List | null>(null);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [previewBackground, setPreviewBackground] = useState<string | null>(null);

  const listIds = useMemo(() => boardData.lists.map(l => l.id), [boardData.lists]);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  const findContainer = useCallback((id: string) => {
    if (listIds.includes(id)) return id;
    return boardData.lists.find((list) => list.cards.some((card) => card.id === id))?.id;
  }, [boardData.lists, listIds]);

  const onDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'List') {
      setActiveList(active.data.current.item);
    } else if (active.data.current?.type === 'Card') {
      setActiveCard(active.data.current.item);
    }
  }, []);

  const onDragEnd = useCallback((event: DragEndEvent) => {
    setActiveList(null);
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAList = active.data.current?.type === 'List';
    if (isActiveAList) {
      setBoardData((board) => {
        const oldIndex = board.lists.findIndex((l) => l.id === activeId);
        const newIndex = board.lists.findIndex((l) => l.id === overId);
        return { ...board, lists: arrayMove(board.lists, oldIndex, newIndex) };
      });
      return;
    }

    const isActiveACard = active.data.current?.type === 'Card';
    if (isActiveACard) {
      setBoardData((board) => {
        const activeContainerId = findContainer(activeId as string);
        const overContainerId = findContainer(overId as string);

        if (!activeContainerId || !overContainerId) return board;

        const activeListIndex = board.lists.findIndex(l => l.id === activeContainerId);
        const overListIndex = board.lists.findIndex(l => l.id === overContainerId);

        if (activeContainerId === overContainerId) {
          const list = board.lists[activeListIndex];
          const oldIndex = list.cards.findIndex(c => c.id === activeId);
          const newIndex = list.cards.findIndex(c => c.id === overId);
          const newCards = arrayMove(list.cards, oldIndex, newIndex);
          const newLists = [...board.lists];
          newLists[activeListIndex] = { ...list, cards: newCards };
          return { ...board, lists: newLists };
        } else {
          const activeList = board.lists[activeListIndex];
          const overList = board.lists[overListIndex];
          const cardToMove = activeList.cards.find(c => c.id === activeId);
          if (!cardToMove) return board;
          const newActiveCards = activeList.cards.filter(c => c.id !== activeId);
          const isOverACard = over.data.current?.type === 'Card';
          const overCardIndex = isOverACard 
            ? overList.cards.findIndex(c => c.id === overId) 
            : overList.cards.length;
          const newOverCards = [...overList.cards];
          newOverCards.splice(overCardIndex, 0, cardToMove);

          const newLists = board.lists.map(list => {
            if (list.id === activeContainerId) return { ...list, cards: newActiveCards };
            if (list.id === overContainerId) return { ...list, cards: newOverCards };
            return list;
          });
          return { ...board, lists: newLists };
        }
      });
    }
  }, [findContainer]);

  const backgroundStyle = {
    transition: 'background 0.3s ease-in-out',
    ...( (previewBackground || boardData.background).startsWith('http')
      ? { backgroundImage: `url(${previewBackground || boardData.background})` }
      : { backgroundColor: previewBackground || boardData.background }
    ),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="h-screen w-full bg-cover bg-center" style={backgroundStyle}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative flex h-full w-full flex-col">
          <BoardHeader board={boardData} />
          <SidebarInset className="flex-grow overflow-hidden p-4">
            <div className="h-full w-full overflow-x-auto">
                <div className="inline-flex h-full items-start gap-4">
                  <SortableContext items={listIds} strategy={horizontalListSortingStrategy}>
                    {boardData.lists.map((list) => <ListComponent key={list.id} list={list} />)}
                  </SortableContext>
                </div>
            </div>
          </SidebarInset>
        </div>
      </div>
      <BoardMenu board={boardData} setPreviewBackground={setPreviewBackground} />
      <DragOverlay>
        {activeList ? <ListComponent list={activeList} isOverlay /> : null}
        {activeCard ? <CardComponent card={activeCard} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

const BoardPage = () => {
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const getSidebarWidth = () => {
    if (isTablet) return '380px';
    return '400px';
  };

  return (
    <SidebarProvider style={{ '--sidebar-width': getSidebarWidth() } as React.CSSProperties}>
      <BoardPageContent />
    </SidebarProvider>
  );
};

export default BoardPage; 