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
    id: card.id,
    data: {
      type: 'Card',
      item: card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
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
        'p-4 h-[60px] flex items-center rounded-xl border relative',
        'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg',
        'hover:border-cyan-400/60 transition-colors duration-300',
        'cursor-grab active:cursor-grabbing select-none',
        isOverlay
          ? 'border-cyan-400 shadow-cyan-500/30 shadow-2xl'
          : 'border-white/20'
      )}
    >
      <p className="text-sm font-medium text-neutral-100">{card.title}</p>
      
      {/* Hover Glow Effect */}
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-cyan-500/50 to-teal-500/50 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default CardComponent; 