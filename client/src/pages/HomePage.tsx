import { Button } from "@/components/ui/button";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <BackgroundBeamsWithCollision>
      <div className="relative z-20 flex flex-col items-center justify-center text-center">
        <h1 className="mb-6 text-4xl font-bold text-foreground md:text-6xl">
          Trello helps teams move
          <br />
          <span className="animate-shimmer bg-[linear-gradient(110deg,theme(colors.primary),45%,theme(colors.teal.300),55%,theme(colors.primary))] bg-[length:200%_100%] bg-clip-text text-transparent">
            work forward.
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-sm text-muted-foreground md:max-w-2xl md:text-xl">
          Collaborate, manage projects, and reach new productivity peaks. From
          high rises to the home office, the way your team works is unique -
          accomplish it all with Trello.
        </p>
        <Button className="mt-6" size="lg" asChild>
          <Link to="/auth">Get Started For Free</Link>
        </Button>
      </div>
    </BackgroundBeamsWithCollision>
  );
};

export default HomePage;