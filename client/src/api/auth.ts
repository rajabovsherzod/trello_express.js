import { type LoginFormValues, type RegisterFormValues } from "@/lib/validations";
import { $axios } from "./axios";
import { type UserResponse } from "@/types";


export const registerUser =  async (userData: RegisterFormValues): Promise<UserResponse> => {
    const { data } = await $axios.post('/users', userData)
    return data
}

export const loginUser = async (userData: LoginFormValues): Promise<UserResponse> => {
    const { data } = await $axios.post('/users/login', userData)
    return data
}

export const refreshToken = async (): Promise<UserResponse> => {
    const { data } = await $axios.get('/users/refresh');
    return data;
}