import axiosInstance from "../axios";

export const getAllUsersInSystem = async () => {
    try {
        const response = await axiosInstance.get(`/users`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createUser = async ({username,email,password,phoneNumber,schoolId}) => {
    try {
        const response = await axiosInstance.post(`/users/school-admin`, {username, email, password, phoneNumber, schoolId});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateUserProfile = async (userId, profileData) => {
    try {
        const formData = new FormData();
        
        // Add text fields
        if (profileData.username) formData.append('username', profileData.username);
        if (profileData.email) formData.append('email', profileData.email);
        if (profileData.phoneNumber) formData.append('phoneNumber', profileData.phoneNumber);
        if (profileData.firstName) formData.append('firstName', profileData.firstName);
        if (profileData.lastName) formData.append('lastName', profileData.lastName);
        
        // Add profile picture if provided
        if (profileData.profilePicture) {
            formData.append('profilePicture', profileData.profilePicture);
        }
        
        const response = await axiosInstance.put(`/users/profile/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const changePassword = async (userId, passwordData) => {
    try {
        const response = await axiosInstance.put(`/users/password/${userId}`, passwordData);
        return response.data;
    } catch (error) {
        throw error;
    }
}