import axiosInstance from "../axios";

export const recordPayment = async(paymentData)=>{
    const formData = new FormData();
    Object.entries(paymentData).forEach(([key, val]) => {
      if (key === 'proof' && Array.isArray(val)) {
        val.forEach((file) => formData.append('proof', file));
      } else {
        formData.append(key, val);
      }
    });
    try {
        const response = await axiosInstance.post('/payment/record-payment',formData);
        return response.data;
    } catch (error) {
        throw error
    }
}

export const getRecordPayment = async ()=>{
    try {
        const response = await axiosInstance.get('/payment');
        return response.data;
    } catch (error) {
        throw error
    }
}