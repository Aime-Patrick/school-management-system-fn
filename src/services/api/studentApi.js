import axiosInstance from "../axios";
import { apiUrl } from "../axios";

export const getAllStudentInSystem = async() => {
    try {
        const response = await axiosInstance.get(`${apiUrl}/students/all-students`);
        return response.data;
    } catch (error) {
        throw error;
    }
};