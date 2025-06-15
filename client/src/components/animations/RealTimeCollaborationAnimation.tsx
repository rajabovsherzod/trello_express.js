
import { motion } from "framer-motion";
import { IconPointer } from "@tabler/icons-react";

export const RealTimeCollaborationAnimation = () => {
        const cursors = [
    { color: "#22d3ee", x: [0, 50, -20, 30, 0], y: [0, 15, 30, 5, 0], duration: 5 },
    { color: "#a3e635", x: [0, -30, 40, -10, 0], y: [0, 25, -10, 20, 0], duration: 6 },
    { color: "#34d399", x: [0, 20, -40, 50, 0], y: [0, -20, 10, -15, 0], duration: 7 },
  ];

  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-card p-2 relative overflow-hidden">
      {/* Static content */}
      <div className="w-full h-full rounded-lg bg-black/30 p-2 flex flex-col space-y-2">
          <div className="bg-[teal-900/60] border border-teal-700/50 rounded-md p-2 flex items-center">
              <p className="text-xs font-medium text-white">Task: Design Landing Page</p>
          </div>
          <div className="bg-[teal-900/60] border border-teal-700/50 rounded-md p-2 flex items-center">
              <p className="text-xs font-medium text-white">// TODO: Add animations</p>
          </div>
      </div>

      {/* Animated Cursors */}
      {cursors.map((cursor, i) => (
        <motion.div
          key={i}
          className="absolute top-0 left-0"
          animate={{
            x: cursor.x,
            y: cursor.y,
          }}
          transition={{
            duration: cursor.duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
        >
          <IconPointer size={20} style={{ color: cursor.color, transform: 'rotate(-45deg)' }} />
        </motion.div>
      ))}
    </div>
  );
};
