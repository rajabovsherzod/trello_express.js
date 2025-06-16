import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUser {
    id: string;
    email: string;
    username: string;
}

interface AuthStore {
    user: IUser | null
    accessToken: string | null
    isAuthenticated: boolean
    setUser: (user: IUser, accessToken: string) => void
    logout: () => void
}

export const userAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            setUser: (user, accessToken) => set({
                user,
                accessToken,
                isAuthenticated: true
            }),
            logout: () => set({
                user: null,
                accessToken: null,
                isAuthenticated: false
            })
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)
