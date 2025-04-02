import axiosInstance from "../axios";
import { apiUrl } from "../axios";

const API_URL = `${apiUrl}/auth`
export const login = async (identifier, password) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/login`, {
            identifier,
            password,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to login");
    }
}