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