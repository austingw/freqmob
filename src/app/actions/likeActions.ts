"use server";

import { validateRequest } from "@/lib/auth/auth";
import { UserLike } from "@/types/userTypes";
import {
  checkLike,
  deletePostLike,
  insertPostLike,
  queryLikeCount,
} from "@/lib/db/operations/likeDbOperations";

export const toggleLike = async (postId: number, profileId: string) => {
  const user = await validateRequest();

  if (!user.user || !user.session) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }

  let alreadyLiked = false;
  try {
    const userLike = await checkLike(postId, profileId);
    if (userLike[0]) {
      alreadyLiked = true;
    }
  } catch (e) {
    console.error(e);
    return {
      status: 500,
      message: "There was an error checking if the post like status",
    };
  }

  console.log(alreadyLiked);
  if (!alreadyLiked) {
    try {
      await insertPostLike(postId, profileId);

      return {
        status: 200,
        message: "Post liked",
      };
    } catch (e) {
      console.error(e);
      return {
        status: 500,
        message: "There was an error liking the post",
      };
    }
  } else {
    try {
      await deletePostLike(postId, profileId);

      return {
        status: 200,
        message: "Post unliked",
      };
    } catch (e) {
      console.error(e);
      return {
        status: 500,
        message: "There was an error unliking the post",
      };
    }
  }
};

export const getUserLike = async (postId: number, profileId: string) => {
  try {
    const userLike = await checkLike(postId, profileId);
    return {
      postId,
      liked: userLike[0] ? true : false,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getUserLikes = async (
  postIds: number[] | null,
  profileId: string
) => {
  if (postIds === null) {
    return [];
  }
  try {
    let userLikes: UserLike[] = [];
    for (const postId of postIds) {
      const userLike = await checkLike(postId, profileId);
      userLikes.push({
        postId,
        liked: userLike[0] ? true : false,
      });
    }
    return userLikes;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getLikeCount = async (postId: number) => {
  try {
    const likeCount = await queryLikeCount(postId);
    return likeCount[0].likeCount;
  } catch (e) {
    console.error(e);
    return 0;
  }
};
