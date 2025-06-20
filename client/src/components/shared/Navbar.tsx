import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import { userAuthStore } from "@/store/auth.store";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    };
    
    // Fallback uchun user ismining birinchi harfini olish
    const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

    return (
        <header className="fixed top-0 inset-x-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:top-6 lg:max-w-screen-xl lg:mx-auto lg:border lg:rounded-full">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Logo />

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center justify-end gap-x-4">
                    {isAuthenticated ? (
                        <>
                            <Button variant="ghost" asChild>
                                <Link to="/dashboard">Dashboard</Link>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user?.username}`} alt={user?.username} />
                                            <AvatarFallback>{userInitial}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user?.username}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                                        Dashboard
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout}>
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link to="/auth" className="text-foreground/80 hover:text-foreground">
                                    Login
                                </Link>
                            </Button>
                            <BackgroundGradient containerClassName="rounded-full" className="p-0">
                                <Button variant="default" asChild>
                                    <Link to="/auth">Get Trello for free</Link>
                                </Button>
                            </BackgroundGradient>
                        </>
                    )}
                    <ThemeToggle />
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden overflow-hidden bg-background border-t"
                    >
                        <div className="p-4 flex flex-col gap-y-4">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-4 px-2">
                                        <Avatar>
                                             <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user?.username}`} alt={user?.username} />
                                            <AvatarFallback>{userInitial}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{user?.username}</p>
                                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="border-t border-border my-2"></div>
                                    <Button variant="ghost" asChild onClick={() => setIsMenuOpen(false)}>
                                        <Link to="/dashboard">Dashboard</Link>
                                    </Button>
                                    <Button variant="ghost" asChild onClick={() => setIsMenuOpen(false)}>
                                        <Link to="/profile">Profile</Link>
                                    </Button>
                                    <Button variant="ghost" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                                        Log out
                                    </Button>
                                </>
                            ) : (
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Button variant="outline" asChild className="w-full">
                                            <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center">
                                                <span className="font-semibold bg-[linear-gradient(110deg,hsl(var(--primary)),45%,hsl(var(--accent)),55%,hsl(var(--primary)))] bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer">
                                                    Get Trello for free
                                                </span>
                                            </Link>
                                        </Button>
                                        <Button variant="outline" asChild className="w-full">
                                            <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center">
                                                <span className="font-semibold bg-[linear-gradient(110deg,hsl(var(--primary)),45%,hsl(var(--accent)),55%,hsl(var(--primary)))] bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer">
                                                    Login
                                                </span>
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <div className="border-t border-border"></div>
                            <div className="flex justify-between items-center px-2">
                                <span className="text-sm text-muted-foreground">Switch theme</span>
                                <ThemeToggle />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;