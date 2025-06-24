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
// Token muddati o'tganda avtomatik yangilash uchun interceptor
$api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Agar xato 401 (Unauthorized) bo'lsa va bu qayta urinish bo'lmasa
        if (error.response.status === 401 && !originalRequest._isRetry) {
            originalRequest._isRetry = true;
            try {
                // Yangi tokenlar olish uchun so'rov yuboramiz. 
                // Bu so'rov o'zi bilan cookie'dagi refreshToken'ni avtomatik olib ketadi.
                const { data } = await $axios.post('/users/refresh'); 

                // Agar backend yangi accessToken va user ma'lumotlarini qaytarsa
                if (data.accessToken && data.user) {
                    // Store'dagi setTokens funksiyasini to'g'ri chaqiramiz
                    userAuthStore.getState().setTokens(data.accessToken, data.user);
                    
                    // Asl, muvaffaqiyatsiz so'rovning sarlavhasini yangi token bilan yangilaymiz
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    
                    // Va o'sha so'rovni qayta yuboramiz
                    return $api.request(originalRequest);
                }
            } catch (refreshError) {
                console.error("Could not refresh token:", refreshError);
                // Agar refresh ham ishlamasa, demak sessiya tugagan, logout qilamiz
                userAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
        
        // Agar xato 401 bo'lmasa yoki bu qayta urinish bo'lsa, xatoni shunchaki qaytaramiz
        return Promise.reject(error);
    }
);