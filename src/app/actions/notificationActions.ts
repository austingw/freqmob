"use server";

import { queryBoardById } from "@/utils/operations/boardDbOperations";
import { insertNotification } from "@/utils/operations/notificationDbOperations";
import { queryPostDetailsById } from "@/utils/operations/postDbOperations";

export const postCommentNotification = async (
  postId: number,
  profileId: string,
  username: string,
) => {
  const postDetails = await queryPostDetailsById(postId);

  if (profileId !== postDetails[0].profileId) {
    try {
      await insertNotification({
        postId,
        content: `u/${username} commented on your post "${postDetails[0].title}"`,
        profileId: postDetails[0].profileId,
      });
    } catch (e) {
      console.error(e);
    }
  }
};

export const postPostNotification = async (
  boardId: number,
  postTitle: number,
  postId: number,
  posterId: string,
  username: string,
) => {
  const boardDetails = await queryBoardById(boardId);
  if (posterId !== boardDetails[0].profileId) {
    try {
      await insertNotification({
        boardId,
        content: `New post ${postTitle} by u/${username} posted in your board "${boardDetails[0].name}"`,
        postId,
        profileId: boardDetails[0].profileId,
      });
    } catch (e) {
      console.error(e);
    }
  }
};
