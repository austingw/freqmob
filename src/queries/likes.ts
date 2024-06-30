import { getLikeCount, getUserLike } from "@/app/actions";
import { UserLike } from "@/types/userTypes";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetUserLike = (
  postId: number,
  profileId: string,
  initialLike: UserLike | null,
) => {
  return useQuery({
    queryKey: ["userLike", postId, profileId],
    queryFn: () => getUserLike(postId, profileId),
    initialData: initialLike,
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
};

export const useGetLikeCount = (postId: number, initialCount: number) => {
  return useQuery({
    queryKey: ["likeCount", postId],
    queryFn: () => getLikeCount(postId),
    initialData: initialCount,
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
};
