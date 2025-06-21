import { z } from "zod";

export const listCreateValidation = z.object({
    name: z.string().min(1, { message: "List name is required." }),
})

export type listCreateValues = z.infer<typeof listCreateValidation>
