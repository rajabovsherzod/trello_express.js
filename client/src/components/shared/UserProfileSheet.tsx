import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '../ui/button';
import { LayoutDashboard, LogOut, User, Settings, Menu } from 'lucide-react';
import { userAuthStore } from '@/store/auth.store';
import { useNavigate } from 'react-router-dom';
import { Separator } from "../ui/separator";
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import React, { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

// Navigatsiya menyusi bandi
const NavLink = ({ icon, text, onClick }: { icon: React.ReactNode, text: string, onClick?: () => void }) => {
    return (
        <Button
            variant="ghost"
            onClick={onClick}
            className="w-full flex items-center justify-start gap-3 p-3 text-base h-auto"
        >
            <span className="text-muted-foreground">{icon}</span>
            <span className="text-foreground">{text}</span>
        </Button>
    )
};

// Xatolikni tuzatish uchun maxsus trigger komponenti
const ConditionalTrigger = React.forwardRef<HTMLButtonElement>((props, ref) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const user = userAuthStore((state) => state.user);
    const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

    if (isMobile) {
        return (
            <Button {...props} ref={ref} variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
            </Button>
        );
    }

    return (
        <Button {...props} ref={ref} variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border-2 border-transparent hover:border-primary transition-colors duration-300">
                <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user?.username}`} alt={user?.username} />
                <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
        </Button>
    );
});
ConditionalTrigger.displayName = 'ConditionalTrigger';

// Asosiy Komponent
export const UserProfileSheet = () => {
    const [isOpen, setIsOpen] = useState(false);
    const user = userAuthStore((state) => state.user);
    const logout = userAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth');
        setIsOpen(false);
    };

    const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "U";
    
    const sheetVariants: Variants = {
        hidden: { x: "100%", opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
        exit: { x: "100%", opacity: 0, transition: { type: "tween", ease: "easeInOut", duration: 0.3 } }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <ConditionalTrigger />
            </SheetTrigger>
            <AnimatePresence>
                {isOpen && (
                    <SheetContent 
                        className="w-[300px] sm:w-[320px] bg-background/90 backdrop-blur-lg border-l-primary/10 p-0 flex flex-col"
                    >
                        <motion.div
                            variants={sheetVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="h-full flex flex-col"
                        >
                            <SheetHeader className="p-4 border-b border-border">
                                <SheetTitle className="text-xl font-semibold text-center text-foreground">
                                    Profile Menu
                                </SheetTitle>
                            </SheetHeader>
                            
                            <div className="p-6 flex flex-col items-center gap-3">
                                <Avatar className="h-20 w-20 border-2 border-primary/20">
                                    <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user?.username}`} alt={user?.username} />
                                    <AvatarFallback className="text-3xl">{userInitial}</AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <p className="text-md font-semibold text-foreground">{user?.username}</p>
                                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                                </div>
                            </div>

                            <Separator />
                            
                            <div className="flex-grow flex flex-col p-3">
                                <NavLink icon={<LayoutDashboard size={18} />} text="Dashboard" onClick={() => { navigate('/dashboard'); setIsOpen(false); }} />
                                <NavLink icon={<User size={18} />} text="Profile" onClick={() => setIsOpen(false)} />
                                <NavLink icon={<Settings size={18} />} text="Settings" onClick={() => setIsOpen(false)} />
                            </div>

                            <div className="p-3 mt-auto">
                               <Separator className="mb-3"/>
                                <Button
                                    variant="ghost"
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-start gap-3 p-3 text-base h-auto text-red-500 hover:bg-red-500/10 hover:text-red-500"
                                >
                                    <LogOut size={18} />
                                    <span>Log Out</span>
                                </Button>
                            </div>
                        </motion.div>
                    </SheetContent>
                )}
            </AnimatePresence>
        </Sheet>
    );
};