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
        formData.append("schoolCode", schoolData.schoolCode);
    if (schoolData.file) {
      formData.append("schoolLogo", schoolData.file);
    }
        const response = await axiosInstance.post(`/school`, formData);
        return response.data
    } catch (error) {
        throw error
    }
}