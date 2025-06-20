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
                            Welcome back, <span className="text-primary">{username}</span>
                        </h1>
                        <TextGenerateEffect
                            words="Here are your boards. Ready to get things done?"
                            className="text-muted-foreground !text-base"
                        />
                    </div>
                    <Button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary/90 hover:bg-primary text-primary-foreground font-semibold py-3 px-5 rounded-lg transition-all duration-300 shadow-md hover:shadow-primary/40 transform hover:-translate-y-1 active:translate-y-0"
                    >
                        + Create New Board
                    </Button>
                </div>
            </div>
            
            <BoardCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}; 