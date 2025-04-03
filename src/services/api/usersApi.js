import axiosInstance from "../axios";
import { apiUrl } from "../axios";

export const getAllUsersInSystem = async () => {
    try {
        const response = await axiosInstance.get(`${apiUrl}/users`);
        return response.data;
    } catch (error) {
        throw error;
    }
};