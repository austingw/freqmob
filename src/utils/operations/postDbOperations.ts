import { db } from "@/db/db";
import { audio, images, posts, profiles } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";

type NewPost = typeof posts.$inferInsert;

export const insertPost = async (post: NewPost) => {
  return await db.insert(posts).values(post);
};

export const queryPosts = async (page: number) => {
  return await db
    .select()
    .from(posts)
    .leftJoin(audio, eq(posts.audioId, audio.id))
    .leftJoin(images, eq(posts.imageId, images.id))
    .innerJoin(profiles, eq(posts.profileId, profiles.id))
    .limit(10)
    .offset((page - 1) * 10)
    .orderBy(desc(posts.createdAt));
};

export const queryPostsByBoard = async (boardId: number, page: number) => {
  return await db
    .select()
    .from(posts)
    .leftJoin(audio, eq(posts.audioId, audio.id))
    .leftJoin(images, eq(posts.imageId, images.id))
    .innerJoin(profiles, eq(posts.profileId, profiles.id))
    .where(eq(posts.boardId, boardId))
    .limit(5)
    .offset((page - 1) * 5)
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

export const queryPostCount = async (boardId?: number) => {
  if (boardId) {
    return await db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.boardId, boardId));
  }

  return await db.select({ count: count() }).from(posts);
};
