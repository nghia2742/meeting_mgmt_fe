import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { Meeting } from '@/types/meeting.type';

const fetchAllMeeting = async () => {
    const response = await apiClient.get<Meeting[] | []>('/usermeetings/meetings/attend');
    return response.data;
};

export const useAllMeeting = ()  => {
    return useQuery({
        queryKey: ['allMeeting'],
        queryFn: ()=> fetchAllMeeting()
    });
};
