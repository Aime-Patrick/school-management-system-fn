import axiosInstance from "../axios";

export const getStudentPayment = async () => {
  try {
    const response = await axiosInstance.get("/student-payments");
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const getStudentPaymentById = async (id) => {
  try {
    const response = await axiosInstance.get(`/student-payments/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const createStudentPayment = async (studentPayment) => {
  try {
    const response = await axiosInstance.post("/student-payments/create", studentPayment);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const updateStudentPaymentStatus = async (studentPayment) => {
  try {
    const response = await axiosInstance.put(`/student-payment/${studentPayment.id}`, studentPayment);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const deleteStudentPayment = async (id) => {
  try {
    const response = await axiosInstance.delete(`/student-payment/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}