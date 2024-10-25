import axios from "axios";
import { startLoading, endLoading } from "../utils/loading";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

// Add a request interceptor
api.interceptors.request.use(
  function (config) {
    // Do something before request is sent

    startLoading();
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  function (response) {
    endLoading();
    return response;
  },
  function (error) {
    endLoading();
    ElMessage({ message: "網路錯誤" });
    return Promise.reject(error);
  }
);

export default api;
