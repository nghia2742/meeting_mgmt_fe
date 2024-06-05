import useAuthStore from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import { LoginRequest, LoginResponse } from "@/types/auth.type";
import { useToast } from "@/components/ui/use-toast";

const fetchLogin = async (credentials: LoginRequest) => {
  const response = await apiClient.post<LoginResponse>(
    "/auth/login",
    credentials
  );
  return response.data;
};

const useLogin = () => {
  const authStore = useAuthStore();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => fetchLogin(credentials),
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data;
      authStore.setTokens(accessToken, refreshToken);
      console.log(data);
      // redirect
    },
    onError: (error: any) => {
      toast({
        title: "Uh oh! Something went wrong",
        description: error.response.data.message,
      });
    },
  });
};

export default useLogin;
