import { $axios, $api } from "./axios";
import type { LoginFormValues, RegisterFormValues } from "@/lib/validations";
import type { UserResponse } from "@/types";
import type { IUser } from "@/types";
import type { CompleteGoogleRegistrationFormValues } from "@/lib/complete-registration-validation";

export const registerUser = async (values: RegisterFormValues): Promise<UserResponse> => {
    const { data } = await $axios.post<UserResponse>('/users/register', values);
    return data;
};

export const verifyEmail = async (data: { email: string; verificationCode: string }) => {
    const response = await $axios.post('/users/verify-email', data);
    return response.data;
};

export const completeGoogleRegistration = async (payload: CompleteGoogleRegistrationFormValues & { token: string }): Promise<UserResponse> => {
    const { data } = await $axios.post<UserResponse>('/users/auth/google/complete-registration', payload);
    return data;
}

export const loginUser = async (values: LoginFormValues): Promise<UserResponse> => {
    const { data } = await $axios.post<UserResponse>('/users/login', values);
    return data;
};

export const refreshToken = async (token: string): Promise<UserResponse> => {
    const { data } = await $axios.post<UserResponse>('/users/refresh', { refreshToken: token });
    return data;
};

export const me = async (): Promise<IUser> => {
    const { data } = await $api.get<IUser>('/users/me'); 
    return data;
};

