import { Button } from "@/components/ui/button";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Link } from "react-router-dom";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const HomePage = () => {
  const paragraphText = `Collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way your team works is unique - accomplish it all with Trello.`;

  return (
    <BackgroundBeamsWithCollision>
      <div className="relative z-20 flex flex-col items-center justify-center text-center">
        <h1 className="mb-6 text-3xl sm:text-4xl font-bold text-foreground md:text-6xl">
          Trello helps teams move
          <br />
          <span className="animate-shimmer bg-[linear-gradient(110deg,hsl(var(--primary)),45%,hsl(var(--accent)),55%,hsl(var(--primary)))] bg-[length:200%_100%] bg-clip-text text-transparent">
            work forward.
          </span>
        </h1>
        
        {/* Paragraf o'rniga TextGenerateEffect */}
        <div className="mx-auto mt-4 max-w-xs text-base sm:text-lg text-muted-foreground md:max-w-2xl md:text-xl">
            <TextGenerateEffect words={paragraphText} />
        </div>

        <BackgroundGradient containerClassName="rounded-full mt-6" className="p-0">
          <Button className="w-full" size="lg" asChild>
            <Link to="/auth">Get Started For Free</Link>
          </Button>
        </BackgroundGradient>
      </div>
    </BackgroundBeamsWithCollision>
  );
};

export default HomePage;