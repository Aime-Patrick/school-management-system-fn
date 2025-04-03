import axiosInstance from "../axios";
import { apiUrl } from "../axios";

console.log(apiUrl)
export const login = async ({identifier, password}) => {
    try {
        const response = await axiosInstance.post(`${apiUrl}/auth/login`, {
            identifier,
            password,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to login");
    }
}