import apiClient from "@/lib/apiClient";
import { useMutation } from "@tanstack/react-query";

const fetchUpdateMeeting = () => {
  const response = apiClient.patch("/meeting/");
  return response;
};

export const useUpdateMeeting = () => {
  return useMutation({ mutationFn: fetchUpdateMeeting });
};
