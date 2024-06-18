import useAuthStore from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import { LoginRequest, LoginResponse } from "@/types/auth.type";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import useUserStore from "@/stores/userStore";

const fetchLogin = async (credentials: LoginRequest) => {
  const response = await apiClient.post<LoginResponse>(
    "/auth/login",
    credentials
  );
  return response.data;
};

const useLogin = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const router = useRouter();
  const fetchUserProfile = useUserStore((state) => state.fetchUserProfile);


  return useMutation({
    mutationFn: (credentials: LoginRequest) => fetchLogin(credentials),
    onSuccess: (data) => {
      const accessToken = Cookies.get("accessToken") || "";
      const refreshToken = Cookies.get("refreshToken") || "";
      setTokens(accessToken, refreshToken);

      fetchUserProfile();
      router.replace("/dashboard");
    },
  });
};

export default useLogin;
