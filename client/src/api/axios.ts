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