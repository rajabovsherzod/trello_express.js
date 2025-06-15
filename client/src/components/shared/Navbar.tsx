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
    <header className="fixed top-0 inset-x-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:top-6 lg:max-w-screen-xl lg:mx-auto lg:border lg:rounded-full">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center justify-end gap-x-4">
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

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
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
            className="lg:hidden overflow-hidden bg-background border-t"
          >
            <div className="container flex flex-col items-stretch gap-y-3 py-4">
              <Button variant="ghost" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button variant="default" asChild>
                <Link to="/auth">Get Trello for free</Link>
              </Button>
              <div className="flex justify-center pt-2 border-t mt-2">
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