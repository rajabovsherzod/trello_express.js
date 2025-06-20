import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { userAuthStore } from '@/store/auth.store';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

// Yangi, professional "Shimmer" tugmasi
const CreateBoardButton = () => (
    <button 
        className="relative inline-flex h-12 items-center justify-center rounded-lg border border-primary/20 bg-background px-6 font-medium text-foreground transition-all duration-300 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 overflow-hidden group"
    >
        {/* Orqa fondagi yaltiroq effekt */}
        <div 
            className="absolute inset-0 w-full h-full bg-[linear-gradient(110deg,transparent,45%,hsl(var(--primary)/0.2),55%,transparent)] bg-[length:250%_100%] transition-all duration-500 group-hover:bg-[length:250%_100%] group-hover:animate-shimmer"
        />
        <div className="relative z-10 flex items-center">
             <Plus className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-90" />
             <span>Create New Board</span>
        </div>
    </button>
);


export const DashboardHeader = () => {
  const user = userAuthStore((state) => state.user);

  const welcomeText = `Welcome back, ${user?.username || 'Trello User'}`;
  const subText = "Here are your boards. Ready to get things done?";

  return (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative rounded-xl bg-background/50 backdrop-blur-sm p-6 sm:p-8 mb-8 border border-border/20 overflow-hidden"
    >
        <div className="absolute -top-1/2 -left-1/4 w-full h-[200%] bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--primary)/0.1),transparent)] -z-10" aria-hidden="true"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
                <TextGenerateEffect words={welcomeText} className="text-3xl sm:text-4xl font-bold text-foreground" />
                <p className="text-muted-foreground mt-2 max-w-lg">
                    {subText}
                </p>
            </div>
            
            <div className="mt-4 sm:mt-0 shrink-0">
                <CreateBoardButton />
            </div>
        </div>
    </motion.div>
  );
}; 