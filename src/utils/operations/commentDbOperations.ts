import { db } from "@/db/db";
import { comments, posts, profiles } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

type NewComment = typeof comments.$inferInsert;

export const insertComment = async (comment: NewComment) => {
  await db
    .update(posts)
    .set({
      likeCount: sql`${posts.likeCount} + 1`,
    })
    .where(eq(posts.id, Number(comment.postId)));

  return await db.insert(comments).values(comment);
};

export const queryComments = async (postId: number) => {
  return await db
    .select()
    .from(comments)
    .where(eq(comments.postId, postId))
    .innerJoin(profiles, eq(comments.profileId, profiles.id))
    .orderBy(desc(comments.createdAt));
};

export const queryCommentsByUser = async (profileId: string) => {
  return await db
    .select()
    .from(comments)
    .where(eq(comments.profileId, profileId))
    .innerJoin(posts, eq(posts.id, comments.postId))
    .orderBy(desc(comments.createdAt));
};
