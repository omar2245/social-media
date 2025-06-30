import axios from "axios";
import { startLoading, endLoading } from "../utils/loading";
import { ElMessage } from "element-plus";
export const authApi = axios.create({
  baseURL: "http://127.0.0.1:5000/api/v1/auth",
});

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api/v1",
});

let isRefreshing = false;
let pendingRequests = [];

// 讀取 access token
const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

// 更新 token
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return Promise.reject("No refresh token");

  try {
    const response = await axios.post(
      "http://127.0.0.1:5000/api/v1/auth/refresh",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    const newAccessToken = response.data.access_token;
    localStorage.setItem("access_token", newAccessToken);
    return newAccessToken;
  } catch (error) {
    return Promise.reject(error);
  }
};

// 加上 Authorization
api.interceptors.request.use(
  function (config) {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 處理錯誤與自動刷新
api.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();
          api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

          // 執行所有等待中的請求
          pendingRequests.forEach((cb) => cb(newToken));
          pendingRequests = [];

          return api(originalRequest);
        } catch (err) {
          ElMessage.error("登入逾時，請重新登入");
          localStorage.clear();
          window.location.href = "/login"; // 或其他登入頁
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      // 如果正在刷新，排隊等待 token 更新完成後重試
      return new Promise((resolve) => {
        pendingRequests.push((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    ElMessage({ message: "網路錯誤", type: "error" });
    return Promise.reject(error);
  }
);

export default api;
