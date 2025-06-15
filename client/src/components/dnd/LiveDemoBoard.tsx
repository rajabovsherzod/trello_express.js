import { useState, useMemo } from "react";
import type { CardType, Column } from "./types";
import ColumnContainer from "./Column";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import Card from "./Card";

const initialColumns: Column[] = [
  { id: "todo", title: "🚀 To Do" },
  { id: "in-progress", title: "🛠️ In Progress" },
  { id: "done", title: "✅ Done" },
];

const initialCards: CardType[] = [
    { id: 1, columnId: "todo", content: "Design the landing page hero section" },
    { id: 2, columnId: "todo", content: "Develop the responsive Navbar" },
    { id: 3, columnId: "in-progress", content: "Implement authentication flow" },
    { id: 4, columnId: "in-progress", content: "Create a reusable Button component" },
    { id: 5, columnId: "done", content: "Setup project structure with Vite & TS" },
    { id: 6, columnId: "done", content: "Configure Tailwind CSS theme" },
];


const LiveDemoBoard = () => {
  const [columns] = useState<Column[]>(initialColumns);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [cards, setCards] = useState<CardType[]>(initialCards);

  const [activeCard, setActiveCard] = useState<CardType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // 10px
      },
    })
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Card") {
      setActiveCard(event.active.data.current.card);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveCard(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === "Card";
    if (!isActiveACard) return;

    setCards((cards) => {
      const activeIndex = cards.findIndex((c) => c.id === activeId);

      // Dropping over a column
      const isOverAColumn = over.data.current?.type === "Column";
      if (isOverAColumn) {
        cards[activeIndex].columnId = overId;
        return arrayMove(cards, activeIndex, activeIndex); // Re-trigger render
      }

      // Dropping over a card
      const isOverACard = over.data.current?.type === "Card";
      if (isOverACard) {
        const overIndex = cards.findIndex((c) => c.id === overId);
        if (cards[activeIndex].columnId !== cards[overIndex].columnId) {
          // Change column and move to new position
          cards[activeIndex].columnId = cards[overIndex].columnId;
          return arrayMove(cards, activeIndex, overIndex);
        }
        // Just reorder in the same column
        return arrayMove(cards, activeIndex, overIndex);
      }

      return cards;
    });
  }

  return (
    <div className="flex justify-center">
      <div className="w-full rounded-xl border border-border bg-card/50 p-2 shadow-2xl backdrop-blur-sm sm:p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  cards={cards.filter((card) => card.columnId === col.id)}
                />
              ))}
            </SortableContext>

            {createPortal(
              <DragOverlay>
                {activeCard && <Card card={activeCard} />}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default LiveDemoBoard;
