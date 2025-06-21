import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

interface List {
  id: string;
  title: string;
}

interface BoardMinimapProps {
  lists: List[];
  x: MotionValue<number>;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

const BoardMinimap: React.FC<BoardMinimapProps> = ({ lists, x, viewportRef, canvasRef }) => {
  const minimapRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ viewport: 1, canvas: 1 });

  useEffect(() => {
    const calculateDims = () => {
      const viewportWidth = viewportRef.current?.offsetWidth || 1;
      const canvasWidth = canvasRef.current?.scrollWidth || 1;
      setDims({ viewport: viewportWidth, canvas: canvasWidth });
    };
    calculateDims();
    const resizeObserver = new ResizeObserver(calculateDims);
    if (viewportRef.current) resizeObserver.observe(viewportRef.current);
    if (canvasRef.current) resizeObserver.observe(canvasRef.current);
    return () => resizeObserver.disconnect();
  }, [viewportRef, canvasRef]);

  const viewportWidth = Math.min(100, (dims.viewport / dims.canvas) * 100);
  const viewportLeft = useTransform(x, [0, -(dims.canvas - dims.viewport)], [0, 100 - viewportWidth]);

  return (
    <motion.div 
      ref={minimapRef}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-24 bg-black/50 border border-cyan-500/20 rounded-xl shadow-2xl p-2 backdrop-blur-md minimap-container"
    >
      <div className="relative w-full h-full">
        <div className="flex items-center h-full gap-2 select-none">
          {lists.map(list => (
            <div key={list.id} className="h-full w-16 bg-neutral-700/50 rounded flex items-center justify-center p-1">
              <span className="text-xs text-center text-neutral-300 line-clamp-2">{list.title}</span>
            </div>
          ))}
        </div>

        {/* Viewport Indicator */}
        {viewportWidth < 100 && (
          <motion.div
            className="absolute top-0 h-full bg-cyan-400/30 border-2 border-cyan-400 rounded-lg"
            style={{
              width: `${viewportWidth}%`,
              left: viewportLeft,
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default BoardMinimap; 