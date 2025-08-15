import axiosInstance from "../../axios";

export const getReservations = async () => {
  try {
    const response = await axiosInstance.get('/library/reservations');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReservationById = async (id) => {
  try {
    const response = await axiosInstance.get(`/library/reservations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPendingReservations = async () => {
  try {
    const response = await axiosInstance.get('/library/reservations/pending');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createReservation = async (reservationData) => {
  try {
    const response = await axiosInstance.post('/library/reservations', reservationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateReservation = async (reservationData) => {
  try {
    const { id, ...data } = reservationData;
    const response = await axiosInstance.put(`/library/reservations/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelReservation = async (id) => {
  try {
    const response = await axiosInstance.put(`/library/reservations/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fulfillReservation = async (id) => {
  try {
    const response = await axiosInstance.put(`/library/reservations/${id}/fulfill`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMemberReservations = async (memberId) => {
  try {
    const response = await axiosInstance.get(`/library/reservations/member/${memberId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBookReservations = async (bookId) => {
  try {
    const response = await axiosInstance.get(`/library/reservations/book/${bookId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
