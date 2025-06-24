// client/src/components/board/UserSearch.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { searchUsers } from '@/api/user';
import { createInvitation } from '@/api/invitation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send } from 'lucide-react';
import { Button } from '../ui/button';

interface UserSearchProps {
    boardId: string;
}

export const UserSearch: React.FC<UserSearchProps> = ({ boardId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const queryClient = useQueryClient();

    const { data: users, isLoading: isSearching } = useQuery({
        queryKey: ['user-search', debouncedSearchTerm],
        queryFn: () => searchUsers(debouncedSearchTerm),
        enabled: debouncedSearchTerm.length > 1,
    });

    const { mutate: inviteUser, isPending: isInviting } = useMutation({
        mutationFn: createInvitation,
        onSuccess: (data) => {
            toast.success(`Invitation sent to ${data.toUserEmail}!`);
            queryClient.invalidateQueries({ queryKey: ['board', boardId] });
            setSearchTerm('');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to send invitation.");
        }
    });

    const handleInvite = (email: string) => {
        inviteUser({ boardId, toUserEmail: email });
    };

    return (
        <div className="relative">
            <Input 
                placeholder="Search by email or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-neutral-800 border-neutral-700 h-11 text-base pl-4 pr-10 focus-visible:ring-primary focus-visible:ring-1"
            />
            {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-neutral-400" />}
            
            {/* Natijalar paneli */}
            {debouncedSearchTerm.length > 1 && (
                <div className="absolute top-full mt-2 w-full bg-neutral-900/80 backdrop-blur-sm border border-neutral-700 rounded-lg shadow-lg z-20 max-h-56 overflow-y-auto">
                    {isSearching && users === undefined && (
                        <div className="p-4 text-center text-sm text-neutral-400">Searching...</div>
                    )}
                    
                    {!isSearching && users && users.length === 0 && (
                        <div className="p-4 text-center text-sm text-neutral-400">No users found.</div>
                    )}

                    {users && users.length > 0 && (
                        <div>
                            {users.map((user) => (
                                <div key={user._id} className="flex items-center justify-between p-2.5 m-1 rounded-md hover:bg-neutral-700/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={`https://i.pravatar.cc/40?u=${user._id}`} />
                                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-white">{user.username}</p>
                                            <p className="text-xs text-neutral-400">{user.email}</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10" onClick={() => handleInvite(user.email)} disabled={isInviting}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};