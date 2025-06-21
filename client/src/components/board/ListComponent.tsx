import { useMemo } from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import CardComponent from './CardComponent';
import type { List as ListType, Card as CardType } from '@/types';

interface ListComponentProps {
  list: ListType;
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
    id: list._id,
    data: {
      type: 'List',
      item: list,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const cardIds = useMemo(() => list.cards?.map((c: CardType) => c._id) ?? [], [list.cards]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex w-full lg:w-72 max-h-full flex-shrink-0 flex-col rounded-2xl overflow-hidden',
        'border border-cyan-500/20 bg-teal-950/70 backdrop-blur-2xl shadow-2xl',
        isDragging && 'opacity-40',
        isOverlay && 'ring-2 ring-cyan-400'
      )}
    >
      <div 
        {...attributes}
        {...listeners}
        className="flex items-center justify-between p-4 border-b border-cyan-500/20 cursor-grab active:cursor-grabbing select-none"
      >
        <h2 className="font-semibold text-neutral-50 bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 to-teal-100">{list.name}</h2>
        <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-cyan-300/80 bg-cyan-500/10 px-2 py-1 rounded-full">
              {list.cards?.length || 0}
            </span>
            <button className="p-1.5 rounded-lg hover:bg-white/10" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal size={18} className="text-neutral-300" />
            </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-3 space-y-3">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {list.cards?.map((card: CardType) => (
            <CardComponent key={card._id} card={card} />
          ))}
        </SortableContext>
      </div>

      <div className="p-3 border-t border-cyan-500/20">
        <button className="flex w-full items-center gap-2 rounded-lg p-2 text-teal-200 hover:bg-cyan-400/10 hover:text-cyan-100 transition-colors duration-200">
          <Plus size={18} />
          <span className="font-medium text-sm">Add a card</span>
        </button>
      </div>
    </div>
  );
};

export default ListComponent;