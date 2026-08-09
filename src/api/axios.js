import axios from "axios";
import { startLoading, endLoading } from "../utils/loading";
import { ElMessage } from "element-plus";

export const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1/auth`,
  timeout: 30000, // 30秒超時
});

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  timeout: 30000, // 30秒超時
});

let isRefreshing = false;
let pendingRequests = [];
let activeRequests = 0;
let slowRequestTimer;
let slowRequestMessage = null;
const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

// 更新 token
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return Promise.reject("No refresh token");

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/auth/refresh`,
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

    // 5秒後顯示超時警告
    // 先清除舊的 timer，避免多重計時器同時存在
    activeRequests += 1;
    if (activeRequests === 1) slowRequestTimer = setTimeout(() => {
      if (!slowRequestMessage) {
        slowRequestMessage = ElMessage({
          message: "伺服器回應較慢，請耐心等待...",
          type: "warning",
          duration: 0,
          showClose: true,
        });
      }
    }, 5000);

    return config;
  },
  function (error) {
    activeRequests = Math.max(0, activeRequests - 1);
    clearSlowRequestMessageIfIdle();
    return Promise.reject(error);
  }
);

// 處理錯誤與自動刷新
const clearSlowRequestMessageIfIdle = () => {
  if (activeRequests !== 0) return;
  clearTimeout(slowRequestTimer);
  slowRequestTimer = null;
  if (slowRequestMessage) {
    slowRequestMessage.close();
    slowRequestMessage = null;
  }
};

api.interceptors.response.use(
  function (response) {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) {
    clearTimeout(slowRequestTimer);
    if (slowRequestMessage) {
      // 關閉先前的慢速提示
      slowRequestMessage.close();
      slowRequestMessage = null;
    }
    }
    return response;
  },
  async function (error) {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) {
    clearTimeout(slowRequestTimer);
    if (slowRequestMessage) {
      slowRequestMessage.close();
      slowRequestMessage = null;
    }
    }
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

    ElMessage({
      message: `${error?.response?.data?.message ?? "發生錯誤"}`,
      type: "error",
    });
    return Promise.reject(error);
  }
);

export default api;
