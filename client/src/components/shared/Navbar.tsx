import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, X } from 'lucide-react';
import { toast } from 'sonner';

import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { UserProfileSheet } from '@/components/shared/UserProfileSheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { userAuthStore } from '@/store/auth.store';
import { getMyInvitations, acceptInvitation, declineInvitation } from '@/api/invitation';
import type { Invitation, IUser } from '@/types';

const Navbar = () => {
    const isAuthenticated = userAuthStore((state) => state.isAuthenticated);
    const queryClient = useQueryClient();

    const { data: invitations, isLoading } = useQuery({
        queryKey: ['invitations'],
        queryFn: getMyInvitations,
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
    
    const handleInvitationResponse = (promise: Promise<any>, successMessage: string) => {
        toast.promise(promise, {
            loading: 'Processing...',
            success: () => {
                queryClient.invalidateQueries({ queryKey: ['invitations'] });
                queryClient.invalidateQueries({ queryKey: ['boards-list'] }); // Dashboard'ni yangilash uchun
                return successMessage;
            },
            error: (err) => err.message || 'An error occurred.',
        });
    };

    const acceptMutation = useMutation({
        mutationFn: acceptInvitation,
        onSuccess: () => {
            handleInvitationResponse(Promise.resolve(), 'Invitation accepted! The board is now in your dashboard.');
        }
    });

    const declineMutation = useMutation({
        mutationFn: declineInvitation,
        onSuccess: () => {
             handleInvitationResponse(Promise.resolve(), 'Invitation declined.');
        }
    });

    return (
        <nav className="fixed top-0 left-0 right-0 z-30 bg-background/90 backdrop-blur-sm border-b border-border/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link to={isAuthenticated ? '/dashboard' : '/'}><Logo /></Link>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        {isAuthenticated && (
                            <>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="relative">
                                            <Bell className="h-5 w-5" />
                                            {invitations && invitations.length > 0 && (
                                                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold">
                                                    {invitations.length}
                                                </div>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-80 md:w-96 bg-background/80 backdrop-blur-lg border">
                                        <DropdownMenuLabel className="flex justify-between items-center p-3">
                                            <span className="font-bold text-lg">Invitations</span>
                                            {invitations && invitations.length > 0 && <span className="text-xs font-mono bg-primary/20 text-primary px-2 py-1 rounded-full">{invitations.length}</span>}
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator/>
                                        <div className="max-h-80 overflow-y-auto p-1">
                                            {isLoading && <p className="p-4 text-center text-sm text-muted-foreground">Loading invitations...</p>}
                                            {!isLoading && invitations && invitations.length > 0 ? (
                                                invitations.map((inv) => (
                                                    <div key={inv._id} className="p-3 rounded-lg hover:bg-muted">
                                                        <div className="flex items-start gap-3">
                                                            <Avatar className="h-9 w-9 mt-1">
                                                                <AvatarImage src={`https://i.pravatar.cc/40?u=${(inv.fromUser as IUser)?._id}`} />
                                                                <AvatarFallback>{(inv.fromUser as IUser)?.username.charAt(0).toUpperCase()}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-grow">
                                                                <p className="text-sm text-foreground/90">
                                                                    <span className="font-bold text-foreground">{(inv.fromUser as IUser)?.username}</span> invited you to collaborate on the board <span className="font-bold text-primary">{(inv.boardId as any)?.name}</span>.
                                                                </p>
                                                                <div className='flex gap-2 mt-3'>
                                                                    <Button size="sm" variant="outline" className="h-8 flex-1" onClick={() => declineMutation.mutate(inv._id)}>
                                                                        <X className="h-4 w-4 mr-2" />
                                                                        Decline
                                                                    </Button>
                                                                    <Button size="sm" variant="outline" className="h-8 flex-1" onClick={() => acceptMutation.mutate(inv._id)}>
                                                                        <Check className="h-4 w-4 mr-2" />
                                                                        Accept
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                !isLoading && <p className="p-8 text-sm text-center text-muted-foreground">You have no new invitations.</p>
                                            )}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <UserProfileSheet />
                            </>
                        )}
                        {!isAuthenticated && <Button asChild><Link to="/auth">Login</Link></Button>}
                    </div>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;