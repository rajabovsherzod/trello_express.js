import { z } from 'zod';

export const cardCreateSchema = z.object({
    name: z.string().min(1, { message: 'Card name is required' }),
})

export type CardCreateValues = z.infer<typeof cardCreateSchema>;