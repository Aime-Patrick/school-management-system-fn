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