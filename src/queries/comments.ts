import { getCommentCount, getComments } from "@/app/actions/commentActions";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetComments = (postId: number) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId),
  });
};

export const useGetCommentCount = (postId: number, initialCount: number) => {
  return useQuery({
    queryKey: ["commentCount", postId],
    queryFn: () => getCommentCount(postId),
    initialData: initialCount,
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
};
