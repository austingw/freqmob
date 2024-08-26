import { db } from "@/lib/db/db";
import { likes, posts } from "@/lib/db/schema";
import { and, eq, sql } from "drizzle-orm";

export const checkLike = async (postId: number, profileId: string) => {
  return await db
    .select()
    .from(likes)
    .where(and(eq(likes.postId, postId), eq(likes.profileId, profileId)));
};

export const insertPostLike = async (postId: number, profileId: string) => {
  await db
    .update(posts)
    .set({
      likeCount: sql`${posts.likeCount} + 1`,
    })
    .where(eq(posts.id, Number(postId)));

  return await db.insert(likes).values({
    postId,
    profileId,
  });
};

export const deletePostLike = async (postId: number, profileId: string) => {
  await db
    .update(posts)
    .set({
      likeCount: sql`${posts.likeCount} - 1`,
    })
    .where(eq(posts.id, Number(postId)));

  return await db
    .delete(likes)
    .where(and(eq(likes.postId, postId), eq(likes.profileId, profileId)));
};

export const queryLikeCount = async (postId: number) => {
  return await db
    .select({ likeCount: posts.likeCount })
    .from(posts)
    .where(eq(posts.id, postId));
};
