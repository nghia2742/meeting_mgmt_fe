import {create} from 'zustand';
import { UserProfile } from "@/types/userProfile.type";
import { fetchUserProfile } from "@/lib/apiUser";

interface UserStore {
    userProfile: UserProfile | null;
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    avatarFile: File | null;
    setAvatarFile: (file: File | null) => void;
    fetchUserProfile: () => Promise<void>;
}

const userStore = create<UserStore>((set) => ({
    userProfile: null,
    isLoading: false,
    isError: false,
    error: null,
    avatarFile: null,
    setAvatarFile: (file: File | null) => set({ avatarFile: file }),
    fetchUserProfile: async () => {
        set({ isLoading: true, isError: false, error: null });
        try {
            const userData = await fetchUserProfile();
            set({ userProfile: userData, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false, isError: true, error: error.message });
        }
    }
}));

export default userStore;
