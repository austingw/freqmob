import { db } from "@/db/db";
import { posts } from "@/db/schema";
import { desc } from "drizzle-orm";

type NewPost = typeof posts.$inferInsert;

export const insertPost = async (post: NewPost) => {
  return await db.insert(posts).values(post);
};

export const queryPosts = async () => {
  return await db.query.posts.findMany({
    with: {
      audio: true,
      images: true,
      profile: true,
    },
    limit: 10,
    offset: 0,
    orderBy: [desc(posts.createdAt)],
  });
};
