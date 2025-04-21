import axiosInstance from "../axios";
import { apiUrl } from "../axios";

export const getAllStudentInSystem = async() => {
    try {
        const response = await axiosInstance.get(`/system-admin/all-students`);
        return response.data;
    } catch (error) {
        throw error;
    }
};