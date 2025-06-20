import { z } from "zod"

export const allowedColors = [
    '#01514e', '#2563EB', '#8B5CF6', '#EC4899', '#F59E0B',
    '#FBBF24', '#6B7280', '#EF4444', '#14B8A6', '#84CC16'
] as const

export const boardCreateSchema = z.object({
    name: z.string().min(3, { message: "Board name must be at least 3 characters" }),
    description: z.string().optional(),
    visibility: z.enum(["private", "public"]),
    background: z.string(),
})

export type BoardCreateValues = z.infer<typeof boardCreateSchema>
