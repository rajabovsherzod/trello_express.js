import React, { useMemo } from 'react';
import { MoreHorizontal, Plus } from 'lucide-react';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import CardComponent from './CardComponent';
import type { Card } from './CardComponent';

export interface List {
  id: string;
  title: string;
  cards: Card[];
}

interface ListComponentProps {
  list: List;
  isOverlay?: boolean;
}

const ListComponent: React.FC<ListComponentProps> = ({ list, isOverlay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: 'List',
      item: list,
    },
    // Listni faqat sarlavhasidan ushlab sudrash
    // Bu funksionallikni keyinroq qo'shishimiz mumkin
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const cardIds = useMemo(() => list.cards.map((c) => c.id), [list.cards]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex w-72 max-h-full flex-shrink-0 flex-col rounded-xl border border-white/20 bg-black/30 backdrop-blur-lg shadow-xl',
        isDragging && 'opacity-30',
        isOverlay && 'ring-2 ring-cyan-500'
      )}
    >
      {/* List Header */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between p-3 border-b border-white/10 cursor-grab active:cursor-grabbing select-none"
      >
        <h2 className="font-semibold text-neutral-100">{list.title}</h2>
        <button className="p-1 rounded-md hover:bg-white/10" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal size={16} className="text-neutral-300" />
        </button>
      </div>

      {/* Cards Container */}
      <div className="flex-grow overflow-y-auto p-2 space-y-2">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {list.cards.map((card) => (
            <CardComponent key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>

      {/* List Footer */}
      <div className="p-2 border-t border-white/10">
        <button className="flex w-full items-center gap-2 rounded-lg p-2 text-neutral-300 hover:bg-white/10 hover:text-white">
          <Plus size={16} />
          <span>Add a card</span>
        </button>
      </div>
    </div>
  );
};

export default ListComponent; 