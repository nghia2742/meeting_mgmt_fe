import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';

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
