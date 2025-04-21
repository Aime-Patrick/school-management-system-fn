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