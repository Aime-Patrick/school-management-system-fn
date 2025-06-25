import axiosInstance from '../axios'

export const createClass = async(name) =>{
    try {
        const response = await axiosInstance.post('/classes',name);
        return response.data;
    } catch (error) {
        throw error
    }
}

export const getClass = async ()=>{
    try {
        const response = await axiosInstance.get(`/classes`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getClassById = async (id) => {
    try {
        const response = await axiosInstance.get(`/classes/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const updateClass = async ({id, classData}) => {
    try {
        const response = await axiosInstance.put(`/classes/${id}`, classData);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const deleteClass = async (id) => {
    try {
        const response = await axiosInstance.delete(`/classes/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getClassBySchoolId = async (schoolId) => {
    try {
        const response = await axiosInstance.get(`/classes/school/${schoolId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addCombinationIntoClass = async ({classId, combination}) => {
    console.log("Adding combination into class:", classId, combination);
    try {
        const response = await axiosInstance.post(`/classes/${classId}/combinations`, combination);
        return response.data;
    } catch (error) {
        throw error;
    }
}