import type { CardType } from "./types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CardProps {
  card: CardType;
}

const Card = ({ card }: CardProps) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      card,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-muted p-2.5 rounded-lg border-2 border-primary opacity-50 cursor-grabbing"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-muted p-2.5 rounded-lg border border-border cursor-grab hover:shadow-lg hover:shadow-primary/20 transition-shadow"
    >
      {card.content}
    </div>
  );
};

export default Card;
