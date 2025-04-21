import axiosInstance from '../axios'

export const getSubscription = async () => {
  try {
    const response = await axiosInstance.get('/plans');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const checkSubscriptionStatus = async (id) => {
  try {
    const response = await axiosInstance.get(`/plans/${id}/subscription-status`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const getSubscriptionById = async (id) => {
  try {
    const response = await axiosInstance.get(`/plans/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const addSubscription = async (subscriptionData) => {
  try {
    const response = await axiosInstance.post('/plans', subscriptionData);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const updateSubscription = async (subscriptionData) => {
  try {
    const response = await axiosInstance.patch(`/plans/${subscriptionData.id}`, subscriptionData);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const deleteSubscription = async (id) => {
  try {
    const response = await axiosInstance.delete(`/plans/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const addSubscriptionFeature = async (subscriptionData) => {
  try {
    const response = await axiosInstance.put(`/plans/${subscriptionData.id}/add-features`, subscriptionData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deleteSubscriptionFeature = async (subscriptionData) => {
  try {
    const response = await axiosInstance.put(`/plans/${subscriptionData.id}/remove-features`, subscriptionData);
    return response.data;
  } catch (error) {
    throw error;
  }
}