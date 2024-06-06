import { useRouter } from "next/router";
import useAuthStore from "@/stores/authStore";
import apiClient from "@/lib/apiClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

const fetchLogout = async () => {
  const response = await apiClient.post("/auth/logout");
  return response;
};

const useLogout = () => {
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: fetchLogout,
    onSuccess: () => {
      clearTokens();
      toast({
        title: "Logout Successfully",
        description: "See you again soon!",
        variant: "success",
      });
      router.replace("/auth/login");
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

export default useLogout;
