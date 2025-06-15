
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import { motion } from "framer-motion";
import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { DragAndDropAnimation } from "../animations/DragAndDropAnimation";
import { RealTimeCollaborationAnimation } from "../animations/RealTimeCollaborationAnimation";
import { ResponsiveDesignAnimation } from "../animations/ResponsiveDesignAnimation";
import { CustomizableWorkflowsAnimation } from "../animations/CustomizableWorkflowsAnimation";

export function FeaturesSection() {
  return (
    <section className="py-20">
        <h2 className="text-4xl md:text-6xl font-bold text-center text-foreground mb-12">
            Why Our{" "}
            <span className="bg-clip-text text-transparent animate-shimmer bg-[linear-gradient(110deg,hsl(var(--primary)),45%,hsl(var(--accent)),55%,hsl(var(--primary)))] bg-[length:200%_100%]">
                Trello Clone?
            </span>
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
            <BentoGrid className="max-w-4xl mx-auto">
            {items.map((item, i) => (
                <BentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                header={item.header}
                icon={item.icon}
                className={item.className}
                />
            ))}
            </BentoGrid>
        </motion.div>
    </section>
  );
}
const items = [
  {
    title: "Intuitive Drag & Drop",
    description: "Easily organize your tasks with a smooth, responsive drag-and-drop interface.",
    header: <DragAndDropAnimation />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-2",
  },
  {
    title: "Real-Time Collaboration",
    description: "Work with your team in real-time and see changes as they happen.",
    header: <RealTimeCollaborationAnimation />,
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-1",
  },
  {
    title: "Fully Responsive Design",
    description: "Access your boards on any device, from desktop to mobile.",
    header: <ResponsiveDesignAnimation />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-1",
  },
  {
    title: "Customizable Workflows",
    description: "Adapt the board to your team's unique workflow with custom columns.",
    header: <CustomizableWorkflowsAnimation />,
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-2",
  },
];
