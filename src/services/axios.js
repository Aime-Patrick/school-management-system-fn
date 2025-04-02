import axios from 'axios';

export const apiUrl = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
  baseURL: `${apiUrl}`,
});
// Request Interceptor: Attach Token & Set Headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor: Handle Errors
axiosInstance.interceptors.response.use(
  (response) => response, // Pass successful response
  (error) => {
    if (error.response) {
      // Server responded with a status other than 2xx
      const { status, data } = error.response;

      if (status === 401 || status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    } else if (error.request) {
      console.error("No response from server. Check your network.");
    } else {
      console.error("Request Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
