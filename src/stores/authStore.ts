// authStore.ts
import { create } from "zustand";
import Cookies from "js-cookie";
import apiClient from "@/lib/apiClient";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  role: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
  fetchUserRole: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  accessToken: Cookies.get("accessToken") || null,
  refreshToken: Cookies.get("refreshToken") || null,
  isAuthenticated: !!Cookies.get("accessToken"),
  role: null,
  setTokens: (accessToken: string, refreshToken: string) => {
    Cookies.set("accessToken", accessToken, { secure: true, sameSite: 'strict' });
    Cookies.set("refreshToken", refreshToken, { secure: true, sameSite: 'strict' });
    set({ accessToken, refreshToken, isAuthenticated: true });
  },
  clearTokens: () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    set({ accessToken: null, refreshToken: null, isAuthenticated: false, role: null });
  },
  fetchUserRole: async () => {
    try {
      const response = await apiClient.get('/users/profile');
      set({ role: response.data.role });
    } catch (error) {
      console.error('Failed to fetch user role', error);
    }
  },
}));

export default useAuthStore;
