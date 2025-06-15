import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <div className="flex items-center justify-end gap-x-2">
          <Button variant="outline" asChild>
            <Link to="/auth">Login</Link>
          </Button>
          <Button variant="default" asChild>
            <Link to="/auth">Get Trello for free</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;