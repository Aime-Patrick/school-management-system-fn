import axiosInstance from "../axios";


export const getAllStudentInSystem = async() => {
    try {
        const response = await axiosInstance.get(`/system-admin/all-students`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getStudentBySchool = async () => {
    try {
        const response = await axiosInstance.get(`/students`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const registerStudent = async (studentData) => {
    try {
        const response = await axiosInstance.post(`/students`, studentData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteStudent = async (id) => {
    try {
        const response = await axiosInstance.delete(`/students/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getStudentById = async (id) => {
    try {
        const response = await axiosInstance.get(`/students/logged-student/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}