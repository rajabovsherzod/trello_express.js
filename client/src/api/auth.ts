import { $axios, $api } from "./axios";
import type { LoginFormValues, RegisterFormValues } from "@/lib/validations";
import type { UserResponse } from "@/types";

export const registerUser = async (values: RegisterFormValues): Promise<UserResponse> => {
    const { data } = await $axios.post<UserResponse>('/users/register', values);
    return data;
};

export const loginUser = async (values: LoginFormValues): Promise<UserResponse> => {
    const { data } = await $axios.post<UserResponse>('/users/login', values);
    return data;
};

export const refreshToken = async (token: string): Promise<UserResponse> => {
    const { data } = await $axios.post<UserResponse>('/users/refresh', { refreshToken: token });
    return data;
};