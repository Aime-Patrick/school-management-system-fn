import axiosInstance from "../axios";

export const addTeacher = async (teacherData)=>{
    try {
        const response = await axiosInstance.post('/teachers/add-teacher', teacherData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getTeachers = async (id)=>{
    try {
        const response = await axiosInstance.get(`/teachers/school/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getTeacherById = async (id)=>{
    try {
        const response = await axiosInstance.get(`/teachers/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const updateTeacher = async ({id, teacherData})=>{
    try {
        const response = await axiosInstance.put(`/teachers/${id}`, teacherData);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const deleteTeacher = async (id)=>{
    try {
        const response = await axiosInstance.delete(`/teachers/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const resetTeacherPassword = async (id)=>{
    try {
        console.log("Resetting password for teacher with ID:", id);
        const response = await axiosInstance.patch(`/school/reset-teacher-password/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}