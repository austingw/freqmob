import { getComments } from "@/app/actions";
import { useQuery } from "@tanstack/react-query";

export const useGetComments = (postId: number) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId),
  });
};
