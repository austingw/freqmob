import {
  getPostsByBoard,
  getPostsByProfile,
  getPostsBySearchTerm,
} from "@/app/actions/postActions";
import { PostWithMedia } from "@/lib/db/schema";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetPosts = (
  initialPosts: PostWithMedia[] | null,
  page: number,
  sort: SortOptions,
  boardId?: string,
) => {
  return useQuery({
    queryKey: ["posts", boardId, page, sort],
    queryFn: () => getPostsByBoard(page, sort, Number(boardId)),
    initialData: initialPosts,
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
};

export const useGetPostsByProfile = (
  initialPosts: PostWithMedia[] | null,
  page: number,
  profileId: string,
) => {
  return useQuery({
    queryKey: ["posts", profileId, page],
    queryFn: () => getPostsByProfile(page, profileId),
    initialData: initialPosts,
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
};

export const useGetPostsBySearchTerm = (
  initialPosts: PostWithMedia[] | null,
  searchTerm: string,
  page: number,
  sort: SortOptions,
) => {
  return useQuery({
    queryKey: ["posts", searchTerm, page, sort],
    queryFn: () => getPostsBySearchTerm(searchTerm, page, sort),
    initialData: initialPosts,
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
};
