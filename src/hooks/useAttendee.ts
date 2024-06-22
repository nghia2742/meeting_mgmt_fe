import apiClient from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";

const fetchAttendees = async (meetingId: string) => {
    const res = await apiClient.get(`/usermeetings/attendees/${meetingId}`);
    if (res && res.data) {
        return res.data;
    }
};

export const useAttendees = (meetingId: string) => {
    return useQuery({
        queryKey: ['allAttendees'],
        queryFn: () => fetchAttendees(meetingId)
    });
}