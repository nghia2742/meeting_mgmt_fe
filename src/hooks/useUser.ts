import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import useAuthStore from '@/stores/authStore';
import { UserProfile } from '@/types/userProfile.type';

const fetchFilteredUsers = async (email: string) => {
    const response = await apiClient.get(`/users/filter?email=${email}`);
    return response.data;
};

const fetchAllUser = async() => {
    const res = await apiClient.get(`/users`);
    if (res && res.data) {
        return res.data;
    }
};

export const useFilteredUsers = (email: string)  => {
    return useQuery({
        queryKey: ['filteredUsers', email],
        queryFn: () => fetchFilteredUsers(email),
        enabled: !!email
    });
};

export const useAllUser = ()  => {
    return useQuery({
        queryKey: ['allUser'],
        queryFn: () => fetchAllUser()
    });
}

export const fetchUserProfile = async (): Promise<UserProfile> => {
    const { accessToken } = useAuthStore.getState();
    const response = await apiClient.get("/users/profile", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
  };
  
  export const updateUserProfile = async (email: string, userData: UserProfile): Promise<UserProfile> => {
    const { accessToken } = useAuthStore.getState();
    const response = await apiClient.patch(`/users/${email}`, userData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
  };
  
  export const getUser = async () => {
    const { accessToken } = useAuthStore.getState();
    const response = await apiClient.get("/users", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };
  
  export const createUser = async (email: string, password: string, fullName: string) => {
    try {
      const response = await apiClient.post("/auth/register", {
        email,
        password,
        fullName,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  };
  
  export const searchUsersByEmail = async (email: string) => {
    try {
      const response = await apiClient.get(`/users/filter?email=${email}`);
      return response.data;
    } catch (error) {
      throw new Error("Error searching users");
    }
  };
  
  export const softDeleteUser = async (userId: string) => {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error("Error deleting user");
    }
  };
  
  export const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
  
    const response = await apiClient.post('/cloudinary/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.url;
  };
