import useAuthStore from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import { LoginRequest, LoginResponse } from "@/types/auth.type";
import { useToast } from "@/components/ui/use-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const fetchLogin = async (credentials: LoginRequest) => {
  const response = await apiClient.post<LoginResponse>(
    "/auth/login",
    credentials
  );
  return response.data;
};

const useLogin = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => fetchLogin(credentials),
    onSuccess: (data) => {
      const accessToken = Cookies.get("accessToken") || "";
      const refreshToken = Cookies.get("refreshToken") || "";
      setTokens(accessToken, refreshToken);
      console.log("AccessToken: ", accessToken);
      console.log("refreshToken: ", refreshToken);

      toast({
        title: "Login Successfully",
        description: "Welcome to our app",
        variant: "success",
      });
      router.replace("/dashboard");
    },
  });
};

export default useLogin;
