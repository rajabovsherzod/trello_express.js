// client/src/api/user.ts
import { $api } from "./axios";
import type { IUser } from "@/types";

export const searchUsers = async (query: string): Promise<IUser[]> => {
    if (query.trim().length < 2) {
        return [];
    }
    const { data } = await $api.get<IUser[]>(`/users/search?query=${query}`);
    return data;
};