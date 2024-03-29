import { db } from "@/db/db";
import { audio, posts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

type NewPost = typeof posts.$inferInsert;

export const insertPost = async (post: NewPost) => {
  return await db.insert(posts).values(post);
};

export const queryPosts = async () => {
  return await db
    .select()
    .from(posts)
    .leftJoin(audio, eq(posts.audioId, audio.id))
    .orderBy(desc(posts.createdAt));
};

export const queryPostsByBoard = async (boardId: number) => {
  return await db
    .select()
    .from(posts)
    .leftJoin(audio, eq(posts.audioId, audio.id))
    .where(eq(posts.boardId, boardId))
    .orderBy(desc(posts.createdAt));
};

export const queryPostsByProfile = async (profileId: string) => {
  return await db
    .select()
    .from(posts)
    .leftJoin(audio, eq(posts.audioId, audio.id))
    .where(eq(posts.profileId, profileId))
    .orderBy(desc(posts.createdAt));
};
