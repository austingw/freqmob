import {
  getCommentCount,
  getComments,
  getCommentsByProfile,
} from "@/app/actions/commentActions";
import { CommentWithPost } from "@/lib/db/schema";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetComments = (postId: number) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId),
  });
};

export const useGetCommentsByProfile = (
  initialComments: CommentWithPost[] | null,
  page: number,
  profileId: string,
) => {
  return useQuery({
    queryKey: ["comments", profileId, page],
    queryFn: () => getCommentsByProfile(page, profileId),
    initialData: initialComments,
    staleTime: 0,
    placeholderData: keepPreviousData,
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
