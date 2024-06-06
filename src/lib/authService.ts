import apiClient from "./apiClient";
import useAuthStore from "@/stores/authStore";

export const login = async (email: string, password: string) => {
  const { data } = await apiClient.post("/auth/login", { email, password });
  const { accessToken, refreshToken } = data;
  useAuthStore.getState().setTokens(accessToken, refreshToken);
};

export const logout = () => {
  useAuthStore.getState().clearTokens();
  //   apiClient.post("/auth/logout");
};
