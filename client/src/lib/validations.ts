import { z } from "zod";

// Reusable password validation schema
const passwordValidation = z.string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." });

// Schema for user login
export const loginSchema = z.object({
  login: z.string().min(1, { message: "Login field cannot be empty." }),
  password: passwordValidation,
});

// Schema for user registration
export const registerSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: passwordValidation,
});

// Export inferred types for convenience
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
