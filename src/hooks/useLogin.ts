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
      const { accessToken, refreshToken } = data;
      Cookies.set("accessToken", accessToken, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("refreshToken", refreshToken, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });
      setTokens(accessToken, refreshToken);
      console.log(data);
      toast({
        title: "Login Successfully",
        description: "Welcome to our app",
        variant: "success",
      });
      router.replace("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Uh oh! Something went wrong",
        description: error.response.data.message,
        variant: "destructive",
      });
    },
  });
};

export default useLogin;
