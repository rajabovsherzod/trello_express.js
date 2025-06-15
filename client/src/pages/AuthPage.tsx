import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { Github } from "lucide-react";

const AuthPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="mx-auto grid w-[400px] gap-6">
        <div className="grid gap-4 text-center">
          <div className="mx-auto">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-balance text-muted-foreground">
            Choose your preferred sign-in method
          </p>
        </div>
        <div className="grid gap-4">
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
          <Button variant="outline" className="w-full">
            <Github className="mr-2 h-4 w-4" />
            Login with GitHub
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
          Email & Password Form Area
        </div>
      </div>
    </div>
  );
};

export default AuthPage;