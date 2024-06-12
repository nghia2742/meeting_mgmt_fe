import apiClient from "@/lib/apiClient";
import queryClient from "@/lib/reactQueryClient";
import useAuthStore from "@/stores/authStore";
import { DashboardMeeting } from "@/types/meeting.type";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

function useMeetingMutation<T>(
  mutationFn: (
    data: T,
    accessToken: string,
    refreshToken: string
  ) => Promise<any>,
  type: "added" | "updated" | "deleted"
) {
  const { toast } = useToast();
  const accessToken = useAuthStore((state) => state.accessToken) || "";
  const refreshToken = useAuthStore((state) => state.refreshToken) || "";

  return useMutation({
    mutationFn: (data: T) => mutationFn(data, accessToken, refreshToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchMeetings"] });
      toast({
        variant: "success",
        title: `Meeting ${type} successfully`,
        description: "The operation was successful.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.response.data.message,
      });
    },
  });
}

const fetchCreateMeeting = (
  newMeeting: DashboardMeeting,
  accessToken: string,
  refreshToken: string
) => {
  const response = apiClient.post("/meetings", {
    headers: {
      Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
    },
    body: JSON.stringify(newMeeting),
  });
  return response;
};

const fetchUpdateMeeting = (
  updatedMeeting: DashboardMeeting,
  accessToken: string,
  refreshToken: string
) => {
  const response = apiClient.patch(`/meetings/${updatedMeeting.id}`, {
    headers: {
      Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
    },
  });
  return response;
};

const fetchDeleteMeeting = (
  deletedMeetingId: string,
  accessToken: string,
  refreshToken: string
) => {
  const response = apiClient.delete(`/meetings/${deletedMeetingId}`, {
    headers: {
      Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
    },
  });
  return response;
};

export const useCreateMeeting = () => {
  return useMeetingMutation<DashboardMeeting>(fetchCreateMeeting, "added");
};

export const useUpdateMeeting = () => {
  return useMeetingMutation<DashboardMeeting>(fetchUpdateMeeting, "updated");
};

export const useDeleteMeeting = () => {
  return useMeetingMutation<string>(fetchDeleteMeeting, "deleted");
};
