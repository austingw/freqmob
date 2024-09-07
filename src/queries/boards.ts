import { getUserBoardList } from "@/app/actions/boardActions";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetBoardList = (profileId: string) => {
  return useQuery({
    queryKey: ["boardList", profileId],
    queryFn: () => getUserBoardList(profileId),
    staleTime: 0,
    placeholderData: keepPreviousData,
    enabled: !!profileId,
  });
};
