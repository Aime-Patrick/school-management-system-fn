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