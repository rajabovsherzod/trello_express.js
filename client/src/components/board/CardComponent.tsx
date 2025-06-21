import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

export interface Card {
  id: string;
  title: string;
}

interface CardComponentProps {
  card: Card;
  isOverlay?: boolean; // Overlay uchun maxsus stil
}

const CardComponent: React.FC<CardComponentProps> = ({ card, isOverlay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'Card',
      item: card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Sudralayotgan elementning asl joyida qoladigan bo'shliq
  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        className="h-[56px] rounded-lg bg-white/5 border-2 border-dashed border-white/10"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'p-4 h-[56px] flex items-center rounded-lg border bg-black/20 backdrop-blur-sm shadow-md cursor-grab active:cursor-grabbing select-none',
        isOverlay ? 'border-cyan-400' : 'border-white/20 hover:border-white/40',
        'transition-colors duration-200'
      )}
    >
      <p className="text-sm font-medium text-neutral-100">{card.title}</p>
    </div>
  );
};

export default CardComponent; 