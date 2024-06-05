import { create } from "zustand";
import Cookies from "js-cookie";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  accessToken: Cookies.get("accessToken") || null,
  isAuthenticated: !!Cookies.get("accessToken"),
  setAuthenticated: (value: boolean) => {
    set({ isAuthenticated: value });
  },
  clearAuth: () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    set({ accessToken: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
