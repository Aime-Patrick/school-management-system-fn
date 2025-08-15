import axiosInstance from "../../axios";
import { useAuth } from "../../../hooks/useAuth";

export const getBorrowTransactions = async () => {
  try {
    const response = await axiosInstance.get('/library/borrow');
    return response.data;
  } catch (error) {
    console.error('Error fetching borrow transactions:', error);
    return [];
  }
};

export const getBorrowTransactionById = async (id) => {
  try {
    const response = await axiosInstance.get(`/library/borrow/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getActiveBorrows = async () => {
  try {
    // Try different endpoint variations
    let response;
    try {
      // First try without parameters
      response = await axiosInstance.get('/library/borrow/active');
    } catch (noParamError) {
      // If that fails, try the base borrow endpoint and filter
      response = await axiosInstance.get('/library/borrow');
      // Filter for active borrows on the frontend
      if (response.data && Array.isArray(response.data)) {
        const activeBorrows = response.data.filter(borrow => 
          borrow.status === 'borrowed' || borrow.status === 'active'
        );
        return activeBorrows;
      }
    }
    // Ensure we always return an array
    const data = response.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching active borrows:', error);
    // Return empty array instead of throwing error to prevent UI crashes
    return [];
  }
};

export const getOverdueBorrows = async () => {
  try {
    // Try different endpoint variations
    let response;
    try {
      // First try without parameters
      response = await axiosInstance.get('/library/borrow/overdue');
    } catch (noParamError) {
      // If that fails, try the base borrow endpoint and filter
      response = await axiosInstance.get('/library/borrow');
      // Filter for overdue borrows on the frontend
      if (response.data && Array.isArray(response.data)) {
        const overdueBorrows = response.data.filter(borrow => {
          const dueDate = new Date(borrow.dueDate);
          const today = new Date();
          return dueDate < today && (borrow.status === 'borrowed' || borrow.status === 'active');
        });
        return overdueBorrows;
      }
    }
    // Ensure we always return an array
    const data = response.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching overdue borrows:', error);
    // Return empty array instead of throwing error to prevent UI crashes
    return [];
  }
};

export const createBorrowTransaction = async (borrowData) => {
  try {
    const response = await axiosInstance.post('/library/borrow', borrowData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const returnBook = async (returnData) => {
  try {
    const response = await axiosInstance.put(`/library/borrow/${returnData.borrowId}/return`, returnData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const extendDueDate = async (borrowId, newDueDate) => {
  try {
    const response = await axiosInstance.put(`/library/borrow/${borrowId}/extend`, { newDueDate });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAsLost = async (borrowId, notes) => {
  try {
    const response = await axiosInstance.put(`/library/borrow/${borrowId}/lost`, { notes });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMemberBorrows = async (memberId) => {
  try {
    const response = await axiosInstance.get(`/library/borrow/member/${memberId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBookBorrows = async (bookId) => {
  try {
    const response = await axiosInstance.get(`/library/borrow/book/${bookId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
