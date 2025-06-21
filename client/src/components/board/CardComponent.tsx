import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import type { Card as CardType } from '@/types';

export interface Card {
  id: string;
  title: string;
}

interface CardComponentProps {
  card: CardType;
  isOverlay?: boolean;
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
    id: card._id,
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
        className="h-[60px] rounded-xl bg-white/10 border-2 border-dashed border-white/20"
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
        "p-4 rounded-xl border bg-neutral-900/80 border-neutral-700/60 cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 ring-2 ring-rose-500",
        isOverlay && "ring-2 ring-rose-500 shadow-xl"
      )}
    >
      <p className="text-sm font-medium text-neutral-200">{card.name}</p>
      
      {/* Hover Glow Effect */}
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-cyan-500/50 to-teal-500/50 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default CardComponent; 