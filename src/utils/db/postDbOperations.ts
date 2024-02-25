import { db } from "@/db/db";
import { posts } from "@/db/schema";

type NewPost = typeof posts.$inferInsert;

export const insertPost = async (post: NewPost) => {
  return db.insert(posts).values(post);
};
