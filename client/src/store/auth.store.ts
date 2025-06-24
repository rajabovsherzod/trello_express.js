import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { IUser } from "@/types";

const getInitialAccessToken = () => {
    if (typeof window !== 'undefined') {
        const storageValue = localStorage.getItem('auth-storage');
        if (storageValue) {
            try {
                const { state } = JSON.parse(storageValue);
                return state.accessToken || null;
            } catch (error) {
                console.error("Error parsing auth-storage from localStorage", error);
                return null;
            }
        }
    }
    return null;
}

interface AuthStore {
    user: IUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    // O'zgarish mana shu ikki qatorda: user endi 'IUser | null' bo'lishi mumkin
    login: (userData: IUser, accessToken: string) => void;
    logout: () => void;
    setTokens: (accessToken: string, user: IUser | null) => void;
}

const initialAccessToken = getInitialAccessToken();

export const userAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            accessToken: initialAccessToken,
            isAuthenticated: !!initialAccessToken,

            login: (userData, accessToken) => {
                set({
                    user: userData,
                    accessToken,
                    isAuthenticated: true,
                });
            },

            logout: () => {
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                });
            },

            // Bu funksiya endi 'user' uchun 'null'ni ham qabul qila oladi
            setTokens: (accessToken, user) => {
                set({
                    user,
                    accessToken,
                    // Agar user null bo'lsa ham, token borligi uchun 'true' bo'ladi
                    isAuthenticated: !!accessToken,
                });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
        }
    )
);