import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";

axios.defaults.withCredentials = true;

// let navigate = useNavigate();

// Create an Axios instance
const axiosInstance = axios.create({
  // baseURL: "http://localhost:5080/api/",
  baseURL:
  import.meta.env.VITE_APP_API_URL ,
  timeout: 10000, // Set a timeout for requests
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => config,

  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => {
//     if (response.data.statuscode === 401 || response.data.statuscode === 400) {
//       console.error("authentication failed");
//       window.location.href = "/login";
//       return Promise.reject(response);
//     } else if (response.data.statuscode === 409) {
//       console.error("user register failed");
//       window.location.href = "/register";
//       return Promise.reject(response);
//     } else if (response.data.statuscode === 500) {
//       console.error("Server error, please try again later.");
//       return Promise.reject(response);
//     }
//     if (response.data.success && response.data.statuscode === 200) {
//       return response;
//     }
//     return Promise.reject("something went wrong, try again later");
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
