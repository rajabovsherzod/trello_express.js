import axios from "axios";
import { userAuthStore } from "../store/auth.store";

const API_URL = 'http://localhost:5000/api';

// Ommaviy so'rovlar uchun (login, register)
export const $axios = axios.create({
    baseURL: API_URL
});

// Maxfiy so'rovlar uchun (token talab qiladigan)
export const $api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Refresh token cookie'larini yuborish uchun
    headers: {
        'Content-Type': 'application/json'
    }
});

// Har bir maxfiy so'rovdan oldin tokenni avtomatik qo'shish
$api.interceptors.request.use((config) => {
    const accessToken = userAuthStore.getState().accessToken;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// Token muddati o'tganda avtomatik yangilash uchun interceptor
$api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && error.config && !error.config._isRetry) {
            originalRequest._isRetry = true;
            try {
                const { setTokens, logout } = userAuthStore.getState();
                const { data } = await $axios.post('/users/refresh'); 

                if (data.accessToken && data.refreshToken) {
                    setTokens(data.accessToken, data.refreshToken, data.user);
                    // Muvaffaqiyatsiz tugagan so'rovni yangi token bilan qayta yuborish
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    return $api.request(originalRequest);
                } else {
                    logout();
                    return Promise.reject(error);
                }

            } catch (refreshError) {
                console.error("Could not refresh token:", refreshError);
                userAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);