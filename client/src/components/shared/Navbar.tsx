import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '../ui/sheet';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { userAuthStore } from "@/store/auth.store";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { UserProfileSheet } from './UserProfileSheet';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Har bir qiymatni alohida selektor bilan olamiz. Bu cheksiz re-render muammosini hal qiladi.
    const isAuthenticated = userAuthStore((state) => state.isAuthenticated);
    const user = userAuthStore((state) => state.user);
    const logout = userAuthStore((state) => state.logout);
    
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth');
        setIsMenuOpen(false);
    };
    
    // Fallback uchun user ismining birinchi harfini olish
    const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <header className="fixed top-0 inset-x-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:top-6 lg:max-w-screen-xl lg:mx-auto lg:border lg:rounded-full">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Logo />

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center justify-end gap-x-2">
                    {isAuthenticated ? (
                        <>
                            <Button variant="ghost" asChild>
                                <Link to="/dashboard">Dashboard</Link>
                            </Button>
                            <UserProfileSheet />
                        </>
                    ) : (
                        <>
                            <Button asChild>
                                <Link to="/auth">Login</Link>
                            </Button>
                            <BackgroundGradient
                                containerClassName="rounded-full"
                                className="bg-background rounded-full"
                            >
                                <Button
                                    variant="outline"
                                    className="rounded-full"
                                    asChild
                                >
                                    <Link to="/auth">Get Trello for free</Link>
                                </Button>
                            </BackgroundGradient>
                        </>
                    )}
                    <ThemeToggle />
                </div>

                {/* Mobile Menu Button & Sheet */}
                <div className="md:hidden">
                    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full max-w-sm p-0">
                            <div className="flex flex-col h-full">
                                <div className="p-6">
                                    <Logo />
                                </div>
                                <Separator />
                                <div className="flex-grow p-6 space-y-4">
                                {isAuthenticated ? (
                                    <>
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user?.username}`} alt={user?.username} />
                                                <AvatarFallback>{userInitial}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold">{user?.username}</p>
                                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                                            </div>
                                        </div>
                                        <Separator />
                                        <SheetClose asChild>
                                            <Button variant="ghost" className="w-full justify-start" asChild>
                                                <Link to="/dashboard">Dashboard</Link>
                                            </Button>
                                        </SheetClose>
                                         <SheetClose asChild>
                                            <Button variant="ghost" className="w-full justify-start" asChild>
                                                <Link to="/profile">Profile</Link>
                                            </Button>
                                        </SheetClose>
                                    </>
                                ) : (
                                    <>
                                        <SheetClose asChild>
                                            <Button className="w-full" asChild>
                                                <Link to="/auth">Login</Link>
                                            </Button>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Button variant="outline" className="w-full" asChild>
                                                <Link to="/auth">Get Trello for free</Link>
                                            </Button>
                                        </SheetClose>
                                    </>
                                )}
                                </div>
                                <div className="p-6 mt-auto">
                                    {isAuthenticated && (
                                        <Button variant="destructive" className="w-full" onClick={handleLogout}>
                                            Log Out
                                        </Button>
                                    )}
                                    <div className="mt-4">
                                      <ThemeToggle />
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
};

export default Navbar;