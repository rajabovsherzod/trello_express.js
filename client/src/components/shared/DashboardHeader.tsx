import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { userAuthStore } from "@/store/auth.store";
import { TextGenerateEffect } from "../ui/text-generate-effect";
import { BoardCreateModal } from './BoardCreateModal';

export const DashboardHeader = () => {
    const username = userAuthStore((state: any) => state.user?.username);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-primary/[.07] to-transparent border border-border/50 shadow-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Welcome back,{' '}
                            <span className="inline-block animate-shimmer bg-[linear-gradient(110deg,hsl(var(--primary)),45%,hsl(var(--accent)),55%,hsl(var(--primary)))] bg-[length:200%_100%] bg-clip-text text-transparent">
                                {username}
                            </span>
                        </h1>
                        <TextGenerateEffect
                            words="Here are your boards. Ready to get things done?"
                            className="text-muted-foreground !text-base"
                        />
                    </div>
                    <Button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-2 rounded-md bg-[linear-gradient(110deg,hsl(var(--primary)),45%,hsl(var(--accent)),55%,hsl(var(--primary)))] bg-[length:200%_100%] text-white font-semibold transition-colors"
                    >
                        + Create New Board
                    </Button>
                </div>
            </div>
            
            <BoardCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}; 