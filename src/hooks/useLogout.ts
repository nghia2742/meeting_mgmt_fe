import { useRouter } from "next/router";
import useAuthStore from "@/stores/authStore";

const useLogout = () => {
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const router = useRouter();

  const logout = () => {
    console.log("You are logging out");
    clearTokens();
    console.log("You are redirecting");
    router
      .replace("/auth/login")
      .then(() => {
        console.log("Redirect complete");
      })
      .catch((err) => {
        console.error("Redirection error:", err);
      });
    console.log("Done");
  };

  return logout;
};

export default useLogout;
