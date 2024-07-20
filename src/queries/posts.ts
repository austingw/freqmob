import { getPostsByBoard } from "@/app/actions/postActions";
import { PostWithMedia } from "@/db/schema";
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
