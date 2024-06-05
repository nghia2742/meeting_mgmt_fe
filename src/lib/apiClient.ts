import axios from "axios";
import useAuthStore from "@/stores/authStore";

const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshToken } = useAuthStore.getState();
      if (refreshToken) {
        try {
          const response = await apiClient.post(
            "/auth/refresh-token",
            { refreshToken },
            { withCredentials: true }
          );
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data;
          useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);
          apiClient.defaults.headers[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (e) {
          useAuthStore.getState().clearTokens();
          return Promise.reject(e);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
