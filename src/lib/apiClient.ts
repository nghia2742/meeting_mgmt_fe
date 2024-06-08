import axios from "axios";
import useAuthStore from "@/stores/authStore";
import { User } from "@/types/user.type";
import { UserProfile } from "@/types/userProfile.type";

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
export const fetchUserProfile = async () => {
  const { accessToken } = useAuthStore.getState();
  const response = await apiClient.get("/users/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
export const updateUserProfile = async (email: string, userData: UserProfile) => {
  try {
    const { accessToken } = useAuthStore.getState();
    const response = await apiClient.patch(`/users/${email}`, userData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error updating user profile");
  }
};
export const getUser = async () => {
  const { accessToken } = useAuthStore.getState();
  const response = await apiClient.get("/users", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export default apiClient;
