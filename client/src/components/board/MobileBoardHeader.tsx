import React from 'react';
import { Star, Users, MoreHorizontal, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import type { Board } from '@/types';

interface MobileBoardHeaderProps {
  board: Partial<Board>;
}

const MobileBoardHeader: React.FC<MobileBoardHeaderProps> = ({ board }) => {
  const { toggleSidebar } = useSidebar();
  
  return (
    <div className="lg:hidden p-2 bg-neutral-900/60 backdrop-blur-sm border-b border-neutral-700/60 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-neutral-300">
            <Link to="/dashboard">
              <Home className="h-5 w-5" />
            </Link>
          </Button>
          <div className="w-px h-6 bg-neutral-700 mx-1" />
           <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-300">
              <Star className="h-5 w-5" />
            </Button>
        </div>
        
        <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-300">
              <Users className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-300" onClick={toggleSidebar}>
              <MoreHorizontal className="h-5 w-5" />
            </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileBoardHeader;