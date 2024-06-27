import { db } from "@/db/db";
import { likes, posts } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

const checkLike = async (postId: string, profileId: string) => {
  return await db
    .select()
    .from(likes)
    .where(and(eq(likes.postId, postId), eq(likes.profileId, profileId)));
};

export const insertPostLike = async (postId: string, profileId: string) => {
  const userLike = await checkLike(postId, profileId);

  if (userLike.length) {
    return;
  }

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

export const deletePostLike = async (postId: string, profileId: string) => {
  const userLike = await checkLike(postId, profileId);

  if (!userLike.length) {
    return;
  }

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
