import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { registerSchema } from "@/lib/validations";
import type { RegisterFormValues } from "@/lib/validations";
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

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => void;
  isPending: boolean;
}

export const RegisterForm = ({ onSubmit, isPending }: RegisterFormProps) => {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="m@example.com" {...field} />
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
            {isPending ? "Creating Account..." : "Create Account"}
          </Button>
        </BackgroundGradient>
      </form>
    </Form>
  );
};
