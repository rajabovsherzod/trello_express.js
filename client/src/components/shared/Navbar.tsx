import { Link } from 'react-router-dom';
import { userAuthStore } from "@/store/auth.store";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { UserProfileSheet } from './UserProfileSheet';

const Navbar = () => {
    const isAuthenticated = userAuthStore((state) => state.isAuthenticated);

    return (
        <header className="fixed top-0 inset-x-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:top-6 lg:max-w-screen-xl lg:mx-auto lg:border lg:rounded-full">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Logo />

                <div className="flex items-center justify-end gap-x-2">
                    {isAuthenticated ? (
                        <>
                            {/* Desktop uchun "Dashboard" tugmasi, mobil qurilmada yashirin */}
                            <Button variant="ghost" asChild className="hidden md:flex">
                                <Link to="/dashboard">Dashboard</Link>
                            </Button>
                            <UserProfileSheet />
                        </>
                    ) : (
                        <>
                             {/* Desktop uchun Login/Register tugmalari, mobil qurilmada yashirin */}
                            <div className="hidden md:flex items-center gap-x-2">
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
                            </div>
                            {/* Mobil uchun alohida Login tugmasi */}
                            <Button asChild className="md:hidden">
                                <Link to="/auth">Login</Link>
                            </Button>
                        </>
                    )}
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};

export default Navbar;