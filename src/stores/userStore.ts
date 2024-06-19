import { create } from "zustand";
import { UserProfile } from "@/types/userProfile.type";
import { fetchUserProfile as apiFetchUserProfile } from "@/lib/apiUser";

interface UserState {
  userProfile: UserProfile | null;
  avatarFile: File | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  lastFetchTime: number | null;
  fetchUserProfile: () => Promise<void>;
  setAvatarFile: (file: File | null) => void;
  resetUserProfile: () => void;
}

const useUserStore = create<UserState>((set, get) => ({
  userProfile: null,
  avatarFile: null,
  isLoading: false,
  isError: false,
  error: null,
  lastFetchTime: null,
  fetchUserProfile: async () => {
    const { isLoading, userProfile, lastFetchTime } = get();
    const now = Date.now();
    const fetchInterval = 5 * 60 * 1000; // 5 minutes

    // Avoid fetching if it's already loading or was fetched within the last 5 minutes
    if (
      isLoading ||
      (userProfile && lastFetchTime && now - lastFetchTime < fetchInterval)
    )
      return;

    set({ isLoading: true, isError: false, error: null });

    try {
      const userProfile = await apiFetchUserProfile();
      set({ userProfile, isLoading: false, lastFetchTime: now });
    } catch (error: any) {
      set({ isError: true, error: error.message, isLoading: false });
    }
  },
  setAvatarFile: (file) => set({ avatarFile: file }),
  resetUserProfile: () => set({ userProfile: null, lastFetchTime: null }), // Add this method
}));

export default useUserStore;
