import { db } from "@/lib/db/db";
import { comments, posts, profiles } from "@/lib/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";

type NewComment = typeof comments.$inferInsert;

export const insertComment = async (comment: NewComment) => {
  await db
    .update(posts)
    .set({
      commentCount: sql`${posts.commentCount} + 1`,
    })
    .where(eq(posts.id, Number(comment.postId)));

  return await db.insert(comments).values(comment);
};

export const updateComment = async (commentId: number, content: string) => {
  return await db
    .update(comments)
    .set({ content })
    .where(eq(comments.id, commentId));
};

export const deleteComment = async (commentId: number, postId: number) => {
  await db
    .update(posts)
    .set({
      commentCount: sql`${posts.commentCount} - 1`,
    })
    .where(eq(posts.id, postId));

  return await db.delete(comments).where(eq(comments.id, commentId));
};

export const queryComments = async (postId: number) => {
  return await db
    .select()
    .from(comments)
    .where(eq(comments.postId, postId))
    .innerJoin(profiles, eq(comments.profileId, profiles.id))
    .orderBy(desc(comments.createdAt));
};

export const queryCommentById = async (commentId: number) => {
  return await db.select().from(comments).where(eq(comments.id, commentId));
};

export const queryCommentsByProfile = async (
  page: number,
  profileId: string,
) => {
  return await db
    .select()
    .from(comments)
    .where(eq(comments.profileId, profileId))
    .innerJoin(posts, eq(posts.id, comments.postId))
    .limit(10)
    .offset((page - 1) * 10)
    .orderBy(desc(comments.createdAt));
};

export const queryCommentCount = async (postId: number) => {
  return await db
    .select({ commentCount: posts.commentCount })
    .from(posts)
    .where(eq(posts.id, postId));
};

export const queryCommentCountByProfileId = async (profileId: string) => {
  return await db
    .select({ count: count() })
    .from(comments)
    .where(eq(comments.profileId, profileId));
};
