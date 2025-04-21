import axios from "axios";

export const apiUrl = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
  baseURL: `${apiUrl}`,
});


let isLoggingOut = false;
function handleLogout() {
  if (!isLoggingOut) {
    isLoggingOut = true;
    localStorage.removeItem("token");
    window.location.href = "/";
  }
}


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Content-Type"] =
      config.data instanceof FormData ? "multipart/form-data" : "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);


// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       const { status } = error.response;

//       if (status === 403) {
//         handleLogout();
//       }
//     } else if (error.request) {
//       console.error("No response from server. Check your network.");
//     } else {
//       console.error("Request Error:", error.message);
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
