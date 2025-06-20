import { z } from 'zod';

export class UserDto {
    id;
    email;
    username;

    constructor(userModel){
        this.id = userModel._id,
        this.email = userModel.email,
        this.username = userModel.username
    }
}

// Validatsiya sxemalarini qo'shamiz
const register = z.object({
    body: z.object({
        username: z.string().min(3, 'Username must be at least 3 characters long'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters long'),
    }),
});

const login = z.object({
    body: z.object({
        email: z.string().email('Invalid email address').optional(),
        username: z.string().min(3, 'Username must be at least 3 characters').optional(),
        password: z.string().min(1, 'Password is required'),
    }).refine(data => data.email || data.username, {
        message: "Either email or username must be provided",
        path: ["email"],
    }),
});

export const schema = {
    register,
    login,
};