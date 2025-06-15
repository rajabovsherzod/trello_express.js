import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Link } from "react-router-dom";
import { BackgroundGradient } from "@/components/ui/background-gradient";

const Navbar = () => {
  return (
    <header className="fixed top-6 inset-x-0 max-w-screen-xl mx-auto z-50 border rounded-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <div className="flex items-center justify-end gap-x-4">
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
      </div>
    </header>
  );
};

export default Navbar;