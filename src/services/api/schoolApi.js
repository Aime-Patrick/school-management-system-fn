import axiosInstance from "../axios";
import { apiUrl } from "../axios";

export const getSchools = async() =>{
    try {
        const response = await axiosInstance.get(`${apiUrl}/school`);
        return response.data;
    } catch (error) {
        throw error;
    }
}