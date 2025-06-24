import { z } from 'zod'

const passwordValidation = z.string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." });

export const completeRegistrationSchema = z.object({
    username: z.string().min(3, {message: 'Username must be at least 3 characters long.'}),
    password: passwordValidation
})

export type CompleteGoogleRegistrationFormValues = z.infer<typeof completeRegistrationSchema>