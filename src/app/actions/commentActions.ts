"use server";

import { validateRequest } from "@/db/auth";
import {
  insertComment,
  queryCommentCount,
  queryComments,
  updateComment,
} from "@/utils/operations/commentDbOperations";
import { getProfileFromUserId } from "@/utils/operations/userDbOperations";

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
