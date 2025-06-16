import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { loginSchema } from "@/lib/validations";
import type { LoginFormValues } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BackgroundGradient } from "@/components/ui/background-gradient";

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
  isPending: boolean;
}

export const LoginForm = ({ onSubmit, isPending }: LoginFormProps) => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
        <FormField
          control={form.control}
          name="login"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Email or Username</FormLabel>
              <FormControl>
                <Input placeholder="m@example.com or your_username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <BackgroundGradient containerClassName="rounded-lg mt-2" className="p-0">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </BackgroundGradient>
      </form>
    </Form>
  );
};
