import apiClient from "@/lib/apiClient";
import { Meeting } from "@/types/meeting.type";
import { useQuery } from "@tanstack/react-query";

const fetchFiles = async (meetingId: string) => {
    const res = await apiClient.get(`/files/${meetingId}`);
    if (res && res.data) {
        return res.data;
    }
};

export const useAllFiles = (meetingId: string) => {
    return useQuery({
        queryKey: ['allFiles'],
        queryFn: () => fetchFiles(meetingId)
    });
}