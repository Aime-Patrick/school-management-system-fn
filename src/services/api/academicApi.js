import axiosInstance from '../axios'

export const getAcademicYear = async () => {
    try {
        const response = await axiosInstance.get(`/academic`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const createAcademicYear = async (academicYear) => {
    try {
        const response = await axiosInstance.post('/academic', academicYear);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const updateAcademicYear = async (academicYear) => {
    try {
        const response = await axiosInstance.put(`/academic/${academicYear.id}`, academicYear);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const deleteAcademicYear = async (id) => {
    try {
        const response = await axiosInstance.delete(`/academic/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const getAcademicYearById = async (id) => {
    try {
        const response = await axiosInstance.get(`/academic/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createAcademicTerms = async (academicYear) => {
    try {
        const response = await axiosInstance.post('/academic/terms', academicYear);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateAcademicTerms = async (academicYear) => {
    try {
        const response = await axiosInstance.put(`/academic/terms/${academicYear.id}`, academicYear);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteAcademicTerms = async (id) => {
    try {
        const response = await axiosInstance.delete(`/academic/terms/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAcademicTerms = async () => {
    try {
        const response = await axiosInstance.get(`/academic/terms`);
        return response.data;
    } catch (error) {
        throw error;
    }
}