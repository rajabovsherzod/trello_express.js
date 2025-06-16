import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { Github } from "lucide-react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import type { LoginFormValues, RegisterFormValues } from "@/lib/validations";
import { useMutation } from "@tanstack/react-query"; 
import { userAuthStore } from "@/store/auth.store";
import { loginUser, registerUser } from "@/api/auth";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/get-error-message";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const navigate = useNavigate()
  const { setUser } = userAuthStore()

  const {mutate: register, isPending: registerPending} = useMutation({
    mutationKey: ["register"],
    mutationFn: registerUser,
    onSuccess: (data) => {
      setUser(data.user, data.accessToken)
      navigate('/dashboard');
      toast.success("You have successfully registered")
    },
    onError: (error) => {
      toast.error("Registration failed", {
        description: getErrorMessage(error)
      })
    }
  })

  const { mutate: login, isPending: loginPending} = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: (data) => {
      setUser(data.user, data.accessToken)
      navigate('/dashboard');
      toast.success("You have successfully logged in")
    },
    onError: (error) => {
      toast.error("Login failed", {
        description: getErrorMessage(error)
      })
    }
  })

  const isPending = registerPending || loginPending;


  function onSubmit(values: LoginFormValues | RegisterFormValues) {
    if (mode === "login") {
      login(values as LoginFormValues)
    } else {
      register(values as RegisterFormValues)
    }
  }

  return (
    <div className="relative w-full h-screen">
      <BackgroundBeamsWithCollision />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto grid gap-4 p-6 border rounded-lg bg-background/80 backdrop-blur-sm z-10">
          <div className="grid gap-2 text-center">
            <div className="mx-auto">
              <Logo />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              {mode === "login" ? "Welcome Back" : "Create an Account"}
            </h1>
            <p className="text-balance text-muted-foreground">
              {mode === "login"
                ? "Enter your credentials to access your account"
                : "Enter your details to get started"}
            </p>
          </div>

          {mode === "login" ? (
            <LoginForm onSubmit={onSubmit} isPending={isPending}/>
          ) : (
            <RegisterForm onSubmit={onSubmit} isPending={isPending}/>
          )}

          <div className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <Button variant="link" className="p-0" onClick={() => setMode("register")}>
                  Sign up
                </Button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Button variant="link" className="p-0" onClick={() => setMode("login")}>
                  Login
                </Button>
              </>
            )}
          </div>

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
            <Button variant="outline" className="w-full" disabled={isPending}>
              Google
            </Button>
            <Button variant="outline" className="w-full" disabled={isPending}>
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;