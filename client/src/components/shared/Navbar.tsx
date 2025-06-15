import { useState } from "react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Link } from "react-router-dom";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    // On `lg` screens and up, it becomes a floating pill. Below that, it's a standard top bar.
    <header className="fixed top-0 inset-x-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:top-6 lg:max-w-screen-xl lg:mx-auto lg:border lg:rounded-full">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Menu: visible from `md` (768px) upwards */}
        <div className="hidden md:flex items-center justify-end gap-x-4">
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
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button: visible below `md` (768px) */}
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
            // Only show dropdown below `md`
            className="md:hidden overflow-hidden bg-background border-t"
          >
            {/* Use direct padding to avoid `container` class issues and ensure centering */}
            <div className="p-4 flex flex-col gap-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                    {/* Below sm (640px), buttons are stacked. Above, they are side-by-side. */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button variant="outline" asChild className="w-full">
                            <Link to="/auth" className="flex items-center justify-center">
                                <span className="font-semibold bg-[linear-gradient(110deg,hsl(var(--primary)),45%,hsl(var(--accent)),55%,hsl(var(--primary)))] bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer">
                                    Get Trello for free
                                </span>
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                            <Link to="/auth" className="flex items-center justify-center">
                                 <span className="font-semibold bg-[linear-gradient(110deg,hsl(var(--primary)),45%,hsl(var(--accent)),55%,hsl(var(--primary)))] bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer">
                                    Login
                                </span>
                            </Link>
                        </Button>
                    </div>
                </div>
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