import { getPostsByBoard } from "@/app/actions";
import { PostWithMedia } from "@/db/schema";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetPosts = (
  initialPosts: PostWithMedia[] | null,
  page: number,
  boardId?: string,
) => {
  return useQuery({
    queryKey: ["posts", boardId, page],
    queryFn: () => getPostsByBoard(page, Number(boardId)),
    initialData: initialPosts,
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
};
