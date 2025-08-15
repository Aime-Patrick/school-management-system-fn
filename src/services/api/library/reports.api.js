import axiosInstance from "../../axios";


// API Functions
export const getOverdueReport = async () => {
  try {
    const response = await axiosInstance.get('/library/reports/overdue');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMostBorrowedReport = async (limit = 10) => {
  try {
    const response = await axiosInstance.get(`/library/reports/most-borrowed?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLostDamagedReport = async () => {
  try {
    const response = await axiosInstance.get('/library/reports/lost-damaged');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategoryTrendsReport = async () => {
  try {
    const response = await axiosInstance.get('/library/reports/category-trends');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMemberActivityReport = async () => {
  try {
    const response = await axiosInstance.get('/library/reports/member-activity');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFineCollectionReport = async (startDate, endDate) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await axiosInstance.get(`/library/reports/fine-collection?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBorrowingTrendsReport = async (period = 'monthly') => {
  try {
    const response = await axiosInstance.get(`/library/reports/borrowing-trends?period=${period}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBookInventoryReport = async () => {
  try {
    const response = await axiosInstance.get('/library/reports/book-inventory');
    return response.data;
  } catch (error) {
    throw error;
  }
};
