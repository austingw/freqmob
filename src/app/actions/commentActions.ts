"use server";

import { validateRequest } from "@/lib/auth/auth";
import {
  deleteComment,
  insertComment,
  queryCommentById,
  queryCommentCount,
  queryComments,
  updateComment,
} from "@/lib/db/operations/commentDbOperations";
import { getProfileFromUserId } from "@/lib/db/operations/userDbOperations";

export const createComment = async (comment: FormData) => {
  const postId = Number(comment.get("postId"));
  const content = String(comment.get("content"));

  const user = await validateRequest();

  if (!user.user || !user.session) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }
  const profile = await getProfileFromUserId(user.user.id);

  try {
    await insertComment({
      postId,
      content,
      profileId: profile[0].id,
    });
    return {
      status: 201,
      message: "Comment created",
      data: {
        id: profile[0].id,
        name: profile[0].name,
      },
    };
  } catch {
    throw new Error("There was an error creating the comment");
  }
};

export const getComments = async (postId: number) => {
  return await queryComments(postId);
};

export const getCommentCount = async (postId: number) => {
  try {
    const commentCount = await queryCommentCount(postId);
    return commentCount[0].commentCount;
  } catch (e) {
    console.error(e);
    return 0;
  }
};

export const putCommentContent = async (commentId: number, content: string) => {
  try {
    await updateComment(commentId, content);
    return { status: 200, message: "Comment updated" };
  } catch (e) {
    console.error(e);
    return { status: 500, message: "There was an error updating the comment" };
  }
};

export const delComment = async (commentId: number) => {
  const user = await validateRequest();
  const profile = user.user && (await getProfileFromUserId(user.user.id));
  const ogComment = await queryCommentById(commentId);

  if (!profile || !profile[0]) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }

  //todo: add moderator role check
  if (profile[0].id !== ogComment[0].profileId) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }

  try {
    await deleteComment(commentId, ogComment[0].postId);
    return { status: 200, message: "Comment deleted" };
  } catch (e) {
    console.error(e);
    return { status: 500, message: "There was an error deleting the comment" };
  }
};
