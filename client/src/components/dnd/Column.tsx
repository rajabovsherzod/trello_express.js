import type { Column, CardType } from "./types";
import Card from "./Card";
import { SortableContext } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useMemo } from "react";

interface ColumnProps {
  column: Column;
  cards: CardType[];
}

const ColumnContainer = ({ column, cards }: ColumnProps) => {
  const cardsIds = useMemo(() => {
    return cards.map((card) => card.id);
  }, [cards]);

  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="w-[300px] h-full flex flex-col bg-background/50 rounded-lg border border-border flex-shrink-0"
    >
      <div className="p-4 font-bold text-md border-b border-border text-left">
        {column.title}
      </div>
      <div className="flex flex-grow flex-col gap-3 p-3 overflow-y-auto">
        <SortableContext items={cardsIds}>
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default ColumnContainer;
