import { getUserBoardList } from "@/app/actions";
import { useQuery } from "@tanstack/react-query";

export const useGetBoardList = (profileId: string) => {
  return useQuery({
    queryKey: ["boardList", profileId],
    queryFn: () => getUserBoardList(profileId),
  });
};
