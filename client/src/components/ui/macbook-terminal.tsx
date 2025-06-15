import React from "react";
import { cn } from "@/lib/utils";

interface MacbookTerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const MacbookTerminal = ({
  children,
  className,
  ...props
}: MacbookTerminalProps) => {
  return (
    <div
      className={cn(
        "w-full max-w-3xl mx-auto rounded-xl border border-white/20", // Removed background and shadow for transparency
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-x-2 p-3 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div className="p-4 text-left font-mono text-xs text-gray-300 md:text-[13px] lg:text-sm whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );
};

export { MacbookTerminal };
