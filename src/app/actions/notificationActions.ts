"use server";

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
