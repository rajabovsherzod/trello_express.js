// client/src/components/board/ShareBoardModal.tsx

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserSearch } from './UserSearch';
import { useQuery } from '@tanstack/react-query';
import { getBoardById } from '@/api/get-board';

interface ShareBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
}

export const ShareBoardModal: React.FC<ShareBoardModalProps> = ({ isOpen, onClose, boardId }) => {
  const { data: boardData, isLoading } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => getBoardById(boardId),
    enabled: isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* DialogContent'ga yangi, shaffof stillar beramiz */}
      <DialogContent className="sm:max-w-lg bg-black/60 backdrop-blur-md border-neutral-700/80 text-white shadow-2xl shadow-primary/10">
        <DialogHeader className='text-left'>
          <DialogTitle className="text-xl text-white">Share "{boardData?.name || 'Board'}"</DialogTitle>
          <DialogDescription className='text-neutral-400'>
            Invite new members to collaborate on this board.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
            <p className="text-sm font-medium text-neutral-300 mb-2">Invite by email or username</p>
            <UserSearch boardId={boardId} />
        </div>

        <div className="mt-6">
            <h3 className="text-base font-semibold text-neutral-200 mb-3">Current Members</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {isLoading && <p className="text-neutral-400">Loading...</p>}
                {boardData?.members && boardData.members.length > 0 ? (
                    boardData.members.map((member: any) => (
                        <div key={member._id} className="flex items-center justify-between p-2 rounded-md hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9"><AvatarImage src={`https://i.pravatar.cc/40?u=${member._id}`} /><AvatarFallback>{member.username?.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                                <div>
                                    <p className="font-semibold text-white">{member.username}</p>
                                    <p className="text-xs text-neutral-400">{member.email}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-rose-500 text-xs">Remove</Button>
                        </div>
                    ))
                ) : (
                    !isLoading && <p className="text-sm text-neutral-500 text-center py-4">Only you are on this board.</p>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};