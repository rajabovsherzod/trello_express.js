import React from "react";
import { motion } from "framer-motion";

export const ResponsiveDesignAnimation = () => {
  const variants = {
    initial: { width: "50%" }, // Mobile
    animate: {
      width: ["50%", "75%", "100%", "50%"], // Mobile -> Tablet -> Desktop -> Mobile
    },
  };

  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl p-2 relative overflow-hidden items-center justify-center">
      <motion.div
        className="bg-teal-950/80 border border-teal-700/50 rounded-lg h-3/4 p-2 flex flex-col space-y-2 shadow-lg"
        variants={variants}
        initial="initial"
        animate="animate"
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      >
        {/* Header */}
        <div className="w-full h-3 rounded-sm bg-cyan-500" />
        {/* Content */}
        <div className="flex-1 flex space-x-1">
          <div className="w-2/3 h-full bg-teal-800/80 rounded-sm" />
          <div className="w-1/3 h-full bg-teal-800/80 rounded-sm" />
        </div>
      </motion.div>
    </div>
  );
};
