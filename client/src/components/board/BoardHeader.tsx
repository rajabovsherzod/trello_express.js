import React from 'react';
import { Star, Users, MoreHorizontal, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSidebar } from '@/components/ui/sidebar';

interface BoardHeaderProps {
  board: {
    title: string;
    members: { id: string; name: string; avatar: string }[];
  };
}

const BoardHeader: React.FC<BoardHeaderProps> = ({ board }) => {
  const { toggleSidebar } = useSidebar();
  
  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between bg-gradient-to-b from-black/50 to-black/10 px-4 md:h-16 md:px-6 backdrop-blur-lg">
      <div className="flex items-center gap-2 md:gap-4">
        <h1 className="text-lg md:text-xl font-bold text-foreground truncate">{board.title}</h1>
        <div className="hidden md:flex items-center gap-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground transition-colors hover:bg-white/10 hover:text-yellow-400">
                  <Star className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Add to favorites</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex -space-x-2 overflow-hidden">
            <TooltipProvider delayDuration={0}>
              {board.members.map((member) => (
                <Tooltip key={member.id}>
                  <TooltipTrigger asChild>
                    <Avatar className="h-8 w-8 border-2 border-black/50 transition-transform hover:scale-110">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent><p>{member.name}</p></TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <Button variant="secondary" className="hidden md:flex gap-2 bg-white/10 text-white hover:bg-white/20">
          <Filter className="h-4 w-4" /> Filter
        </Button>
        <Button variant="secondary" className="gap-2 bg-white/10 text-white hover:bg-white/20">
          <Users className="h-4 w-4" /> <span className="hidden md:inline">Share</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground transition-colors hover:bg-white/10 hover:text-white"
          onClick={toggleSidebar}
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default BoardHeader; 