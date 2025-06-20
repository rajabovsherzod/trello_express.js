import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IUser } from "@/types";

// Brauzerda xavfsiz tarzda tokenlarni olish uchun yordamchi funksiyalar
const getInitialToken = (key: string) => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
    }
    return null;
}

interface AuthStore {
    user: IUser | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    setUserAndTokens: (user: IUser, accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

const initialAccessToken = getInitialToken('accessToken');
const initialRefreshToken = getInitialToken('refreshToken');

export const userAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            accessToken: initialAccessToken,
            refreshToken: initialRefreshToken,
            isAuthenticated: !!initialAccessToken,
            setUserAndTokens: (user, accessToken, refreshToken) => {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                set({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                });
            },
            logout: () => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
