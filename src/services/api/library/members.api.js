import axiosInstance from "../../axios";

export const getMembers = async () => {
  try {
    const response = await axiosInstance.get('/library/members');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMemberById = async (id) => {
  try {
    const response = await axiosInstance.get(`/library/members/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createMember = async (memberData) => {
  try {
    const response = await axiosInstance.post('/library/members', memberData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMember = async (memberData) => {
  try {
    const { id, ...data } = memberData;
    const response = await axiosInstance.put(`/library/members/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMember = async (id) => {
  try {
    await axiosInstance.delete(`/library/members/${id}`);
  } catch (error) {
    throw error;
  }
};

export const searchMembers = async (query) => {
  try {
    const response = await axiosInstance.get(`/library/members/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMemberBorrowHistory = async (memberId) => {
  try {
    const response = await axiosInstance.get(`/library/members/${memberId}/borrow-history`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
