import { getUserLike } from "@/app/actions";
import { useQuery } from "@tanstack/react-query";

export const useGetUserLike = (postId: number, profileId: string) => {
  return useQuery({
    queryKey: ["userLikes", postId, profileId],
    queryFn: () => getUserLike(postId, profileId),
  });
};
