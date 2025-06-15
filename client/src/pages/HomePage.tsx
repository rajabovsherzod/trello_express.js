import { Button } from "@/components/ui/button";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Link } from "react-router-dom";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { MacbookTerminal } from "@/components/ui/macbook-terminal";
import LiveDemoBoard from "@/components/dnd/LiveDemoBoard";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { Footer } from "@/components/shared/Footer";

const HomePage = () => {
  const paragraphText = `// Collaborate, manage projects, and reach new productivity peaks.\n// From high rises to the home office, the way your team works is unique.\n// Accomplish it all with Trello.`;

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      <BackgroundBeamsWithCollision />
      <div className="relative z-10">
        <div className="bg-background/30">
          <div className="flex flex-col items-center px-4 pt-24 pb-12 text-center md:pt-32 md:pb-20">
          <h1 className="mb-4 text-3xl font-bold text-foreground sm:mb-6 sm:text-4xl md:text-6xl">
            Trello helps teams move
            <br />
            <span className="animate-shimmer bg-[linear-gradient(110deg,hsl(var(--primary)),45%,hsl(var(--accent)),55%,hsl(var(--primary)))] bg-[length:200%_100%] bg-clip-text text-transparent">
              work forward.
            </span>
          </h1>

          <div className="mt-6 w-full max-w-4xl sm:mt-8">
            <MacbookTerminal>
              <TextGenerateEffect words={paragraphText} />
            </MacbookTerminal>
          </div>

          <BackgroundGradient containerClassName="rounded-full mt-6 sm:mt-8" className="p-0">
            <Button className="w-full" size="lg" asChild>
              <Link to="/auth">Get Started For Free</Link>
            </Button>
          </BackgroundGradient>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-12 sm:pb-16 md:pb-24">
          <div className="max-w-5xl mx-auto">
            <FeaturesSection />

            <div className="mt-16 sm:mt-20 md:mt-24">
              <h2 className="mb-8 text-center text-2xl font-bold sm:mb-12 sm:text-3xl md:text-4xl">
                Interactive Live Demo
              </h2>
              <LiveDemoBoard />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;