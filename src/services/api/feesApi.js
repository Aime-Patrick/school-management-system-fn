import axiosInstance from "../axios";

// Fee Categories
export const createFeeCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post("/fees/categories", categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFeeCategories = async () => {
  try {
    const response = await axiosInstance.get("/fees/categories");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateFeeCategory = async ({ id, ...categoryData }) => {
  try {
    const response = await axiosInstance.patch(`/fees/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFeeCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`/fees/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fee Structures
export const createFeeStructure = async (structureData) => {
  try {
    const response = await axiosInstance.post("/fees/structures", structureData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFeeStructures = async () => {
  try {
    const response = await axiosInstance.get("/fees/structures");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateFeeStructure = async ({ id, ...structureData }) => {
  try {
    const response = await axiosInstance.put(`/fees/structures/${id}`, structureData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFeeStructure = async (id) => {
  try {
    const response = await axiosInstance.delete(`/fees/structures/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fee Assignments
export const autoAssignFees = async (assignmentData) => {
  try {
    const response = await axiosInstance.post("/fees/assignments/auto-assign", assignmentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFeeAssignments = async (studentId) => {
  try {
    const response = await axiosInstance.get(`/fees/assignments/${studentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllFeeAssignments = async () => {
  try {
    const response = await axiosInstance.get("/fees/assignments");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fee Payments
export const createFeePayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post("/fees/payments", paymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFeePayments = async () => {
  try {
    const response = await axiosInstance.get("/fees/payments");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approveFeePayment = async (paymentId) => {
  try {
    const response = await axiosInstance.put(`/fees/payments/${paymentId}/approve`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectFeePayment = async (paymentId, reason) => {
  try {
    const response = await axiosInstance.put(`/fees/payments/${paymentId}/reject`, { reason });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fee Reports
export const getOutstandingFeesReport = async (schoolId, filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.classId) params.append('classId', filters.classId);
    if (filters.academicYear) params.append('academicYear', filters.academicYear);
    if (filters.term) params.append('term', filters.term);
    
    const response = await axiosInstance.get(`/fees/reports/outstanding/${schoolId}?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPaymentSummaryReport = async (schoolId, dateRange) => {
  try {
    const params = new URLSearchParams();
    if (dateRange && dateRange[0]) params.append('startDate', dateRange[0]);
    if (dateRange && dateRange[1]) params.append('endDate', dateRange[1]);
    
    const response = await axiosInstance.get(`/fees/reports/summary/${schoolId}?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDefaulterList = async (schoolId, daysOverdue = 30) => {
  try {
    const params = new URLSearchParams();
    if (daysOverdue !== 30) params.append('daysOverdue', daysOverdue);
    
    const response = await axiosInstance.get(`/fees/reports/defaulters/${schoolId}?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentPaymentHistory = async (studentId) => {
  try {
    const response = await axiosInstance.get(`/fees/reports/student/${studentId}/history`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFeeCollectionReport = async (schoolId, dateRange, groupBy = 'month') => {
  try {
    const params = new URLSearchParams();
    if (dateRange && dateRange[0]) params.append('startDate', dateRange[0]);
    if (dateRange && dateRange[1]) params.append('endDate', dateRange[1]);
    if (groupBy !== 'month') params.append('groupBy', groupBy);
    
    const response = await axiosInstance.get(`/fees/reports/collection/${schoolId}?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
