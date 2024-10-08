"use server";

import { queryBoardById } from "@/lib/db/operations/boardDbOperations";
import {
  deleteNotification,
  insertNotification,
  queryUserNotifications,
  updateNotificationAsRead,
} from "@/lib/db/operations/notificationDbOperations";
import { queryPostDetailsById } from "@/lib/db/operations/postDbOperations";

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

export const postPostNotification = async (req: {
  boardId: number;
  postId: number;
  posterId: string;
  postTitle: string;
}) => {
  const boardDetails = await queryBoardById(req.boardId);
  if (req.posterId !== boardDetails[0].profileId) {
    try {
      await insertNotification({
        boardId: req.boardId,
        content: `New post ${req.postTitle} posted in your board "${boardDetails[0].name}"`,
        postId: req.postId,
        profileId: boardDetails[0].profileId,
      });
    } catch (e) {
      console.error(e);
    }
  }
};

export const getNotifications = async (profileId: string, page: number) => {
  const notifications = await queryUserNotifications(profileId, page);
  return notifications;
};

export const putNotificationRead = async (notificationId: number) => {
  try {
    await updateNotificationAsRead(notificationId);
    return { status: 200, message: "Notification read" };
  } catch (e) {
    console.error(e);
    return {
      status: 500,
      message: "There was an error reading the notification",
    };
  }
};

export const delNotification = async (notificationId: number) => {
  try {
    await deleteNotification(notificationId);
    return { status: 200, message: "Notification deleted" };
  } catch (e) {
    console.error(e);
    return {
      status: 500,
      message: "There was an error deleting the notification",
    };
  }
};
