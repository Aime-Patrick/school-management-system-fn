import axiosInstance from "../axios";
import { apiUrl } from "../axios";

export const getSchools = async() =>{
    try {
        const response = await axiosInstance.get(`/system-admin/all-schools`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const isSchoolAdminRegisteredSchool = async()=>{
    try {
        const response = await axiosInstance.get(`/school/school-admin`)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const registerSchool = async(schoolData)=>{
    try {
        const formData = new FormData();
        formData.append("schoolName", schoolData.schoolName);
        formData.append("address", schoolData.address);
    if (schoolData.file) {
      formData.append("schoolLogo", schoolData.file);
    }
        const response = await axiosInstance.post(`/school`, formData);
        return response.data
    } catch (error) {
        throw error
    }
}

// Suspend school
export const suspendSchool = async (schoolId, reason) => {
    try {
        const response = await axiosInstance.patch(`/school/${schoolId}/suspend`, { reason });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Activate school
export const activateSchool = async (schoolId, reason) => {
    try {
        const response = await axiosInstance.patch(`/school/${schoolId}/activate`, { reason });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Check school status
export const checkSchoolStatus = async (schoolId) => {
    try {
        const response = await axiosInstance.get(`/school/${schoolId}/status`);
        return response.data;
    } catch (error) {
        throw error;
    }
};