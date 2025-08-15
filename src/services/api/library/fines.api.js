import axiosInstance from "../../axios";

export const getFines = async () => {
  try {
    const response = await axiosInstance.get('/library/fines');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFineById = async (id) => {
  try {
    const response = await axiosInstance.get(`/library/fines/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUnpaidFines = async () => {
  try {
    const response = await axiosInstance.get('/library/fines/unpaid');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPaidFines = async () => {
  try {
    const response = await axiosInstance.get('/library/fines/paid');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createFine = async (fineData) => {
  try {
    const response = await axiosInstance.post('/library/fines', fineData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateFine = async (fineData) => {
  try {
    const { id, ...data } = fineData;
    const response = await axiosInstance.put(`/library/fines/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const payFine = async (paymentData) => {
  try {
    const response = await axiosInstance.put(`/library/fines/${paymentData.fineId}/pay`, paymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const waiveFine = async (fineId, waivedBy, notes) => {
  try {
    const response = await axiosInstance.put(`/library/fines/${fineId}/waive`, { waivedBy, notes });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMemberFines = async (memberId) => {
  try {
    const response = await axiosInstance.get(`/library/fines/member/${memberId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBookFines = async (bookId) => {
  try {
    const response = await axiosInstance.get(`/library/fines/book/${bookId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const calculateOverdueFine = async (borrowId) => {
  try {
    const response = await axiosInstance.get(`/library/fines/calculate-overdue/${borrowId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
