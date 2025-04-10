import axiosInstance from "../axios";

export const getAllUsersInSystem = async () => {
    try {
        const response = await axiosInstance.get(`/users`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createUser = async ({username,email,password,phoneNumber}) => {
    try {
        const response = await axiosInstance.post(`/users/school-admin`, {username, email, password, phoneNumber});
        return response.data;
    } catch (error) {
        throw error;
    }
}