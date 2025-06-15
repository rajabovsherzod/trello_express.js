import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const initialData = {
  "To Do": [
    { id: "task-1", content: "Design API" },
    { id: "task-2", content: "Plan Sprint" },
  ],
  "In Progress": [
    { id: "task-3", content: "Build UI" },
    { id: "task-4", content: "Test Feature" },
  ],
};

export const DragAndDropAnimation = () => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      setData(currentData => {
        const newData = JSON.parse(JSON.stringify(currentData));
        switch (step) {
          case 0: // Swap T1 and T3
            [newData["To Do"][0], newData["In Progress"][0]] = [newData["In Progress"][0], newData["To Do"][0]];
            break;
          case 1: // Swap T2 and T4
            [newData["To Do"][1], newData["In Progress"][1]] = [newData["In Progress"][1], newData["To Do"][1]];
            break;
          case 2: // Return T1 and T3
            [newData["To Do"][0], newData["In Progress"][0]] = [newData["In Progress"][0], newData["To Do"][0]];
            break;
          case 3: // Return T2 and T4
            [newData["To Do"][1], newData["In Progress"][1]] = [newData["In Progress"][1], newData["To Do"][1]];
            break;
        }
        return newData;
      });
      step = (step + 1) % 4;
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-card p-2 space-x-2 relative">
      {Object.entries(data).map(([columnId, tasks]) => (
        <div key={columnId} className="w-1/2 h-full rounded-lg bg-black/30 p-2 flex flex-col space-y-2">
          <h3 className="text-sm font-semibold text-neutral-300 capitalize">{columnId}</h3>
          <div className="flex flex-col space-y-2">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layoutId={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="w-full p-2 rounded-lg bg-teal-900/60 border border-teal-700/50 shadow-lg"
                >
                  <p className="text-xs font-medium text-white">{task.content}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
};
