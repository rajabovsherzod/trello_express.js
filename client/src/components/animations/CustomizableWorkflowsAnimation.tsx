import { motion } from "framer-motion";

const initialColumns = [
  { id: "col-1", title: "Backlog", color: "#845EC2", tasks: [{ id: 't1', content: 'User Story 1' }, { id: 't2', content: 'Bug Fix' }] },
  { id: "col-2", title: "In Progress", color: "#FF9671", tasks: [{ id: 't3', content: 'Feature Dev' }] },
  { id: "col-3", title: "Done", color: "#00C9A7", tasks: [{ id: 't4', content: 'Release v1' }] },
];

const colors = ["#06b6d4", "#10b981", "#22c55e"];

export const CustomizableWorkflowsAnimation = () => {
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-card p-2 relative items-center justify-center space-x-2">
      {initialColumns.map((col, i) => (
        <div key={col.id} className="w-1/3 h-full rounded-lg p-1 flex flex-col items-center space-y-2 bg-black/30">
          <motion.div
            className="w-full p-1 rounded-t-md flex items-center justify-center shadow-inner"
            animate={{ backgroundColor: i === 0 ? colors : col.color }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
          >
            <p className="text-xs font-bold text-white tracking-wide">
              {col.title}
            </p>
          </motion.div>
          <div className="w-full flex-1 p-1 space-y-1">
            {col.tasks.map(task => (
                <div key={task.id} className="w-full p-1 rounded-sm bg-teal-900/60 border-t border-teal-700/50">
                  <p className="text-xs font-medium text-white">{task.content}</p>
                </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
