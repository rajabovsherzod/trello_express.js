import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { Github } from "lucide-react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BackgroundGradient } from "@/components/ui/background-gradient";

const AuthPage = () => {
  return (
    <BackgroundBeamsWithCollision>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <div className="mx-auto grid w-[450px] gap-6 p-8 border rounded-lg bg-background/80 backdrop-blur-sm">
          <div className="grid gap-2 text-center">
            <div className="mx-auto">
              <Logo />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Get Started</h1>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <BackgroundGradient containerClassName="rounded-lg mt-2" className="p-0">
              <Button type="submit" className="w-full">
                Login
              </Button>
            </BackgroundGradient>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or sign in with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              Google
            </Button>
            <Button variant="outline" className="w-full">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
};

export default AuthPage;