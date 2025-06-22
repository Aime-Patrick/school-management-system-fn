import axiosInstance from "../axios";
import { apiUrl } from "../axios";

export const login = async ({identifier, password, rememberMe}) => {
    try {
        const response = await axiosInstance.post(`${apiUrl}/auth/login`, {
            identifier,
            password,
            rememberMe
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const resetPassword = async ({ token, newPassword }) => {
    try {
        const response = await axiosInstance.post(`/auth/reset-password/${token}`, {
            newPassword
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const forgotPassword = async (identifier) => {
    try {
        const response = await axiosInstance.post(`/auth/forgot-password`, {
            identifier
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}