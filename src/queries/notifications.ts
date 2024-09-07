import { getNotifications } from "@/app/actions/notificationActions";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetNotifications = (profileId: string, page: number) => {
  return useQuery({
    queryKey: ["notifications", profileId, page],
    queryFn: () => getNotifications(profileId, page),
    staleTime: 0,
    placeholderData: keepPreviousData,
    enabled: !!profileId,
  });
};
