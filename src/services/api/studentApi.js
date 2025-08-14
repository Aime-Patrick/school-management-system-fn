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

export const uploadProfilePicture = async (file) => {
    try {
        const formData = new FormData();
        formData.append('profilePicture', file); // 'profilePicture' should match the backend's expected field name
        const response = await axiosInstance.post(`/upload/profile-picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.url; // Assuming the backend returns { url: "cloudinary_url" }
    } catch (error) {
        throw error;
    }
};

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

export const updateStudent = async ({ regNumber, data }) => {
    try {
        const response = await axiosInstance.put(`/students/${regNumber}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}
