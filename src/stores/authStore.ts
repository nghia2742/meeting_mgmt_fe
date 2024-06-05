import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
  setTokens: (accessToken, refreshToken) =>
    set({ accessToken, refreshToken, isLoggedIn: !!accessToken }),
  clearTokens: () =>
    set({ accessToken: null, refreshToken: null, isLoggedIn: false }),
}));

export default useAuthStore;
