// client/src/components/auth/CompleteRegistrationForm.tsx

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { completeRegistrationSchema, type CompleteGoogleRegistrationFormValues } from "@/lib/complete-registration-validation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CompleteRegistrationFormProps {
  onSubmit: (values: CompleteGoogleRegistrationFormValues) => void;
  isPending: boolean;
  defaultUsername?: string;
}

export const CompleteRegistrationForm = ({ onSubmit, isPending, defaultUsername = '' }: CompleteRegistrationFormProps) => {
  const form = useForm<CompleteGoogleRegistrationFormValues>({
    resolver: zodResolver(completeRegistrationSchema),
    defaultValues: {
      username: defaultUsername,
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl><Input placeholder="your_unique_username" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-2" disabled={isPending}>
          {isPending ? "Completing Registration..." : "Complete Registration"}
        </Button>
      </form>
    </Form>
  );
};