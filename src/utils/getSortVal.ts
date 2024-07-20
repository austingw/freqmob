import { posts } from "@/db/schema";

export const getSortVal = (sort: SortOptions) => {
  switch (sort) {
    case "new":
      return posts.createdAt;
    case "likes":
      return posts.likeCount;
    case "comments":
      return posts.commentCount;
    default:
      return posts.createdAt;
  }
};
