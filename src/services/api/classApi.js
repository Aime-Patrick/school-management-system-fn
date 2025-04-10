import axiosInstance from '../axios'

export const createClass = async() =>{
    try {
        const response = await axiosInstance.post('/classes');
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