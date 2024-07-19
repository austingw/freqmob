"use server";

import { UpdateProfile } from "@/types/userTypes";
import { queryCommentsByProfile } from "@/utils/operations/commentDbOperations";
import { queryPostsByProfile } from "@/utils/operations/postDbOperations";
import {
  getProfileFromUsername,
  updateProfile,
} from "@/utils/operations/userDbOperations";

export const getProfileByName = async (username: string) => {
  try {
    const profile = await getProfileFromUsername(username);
    return {
      status: 200,
      data: profile[0],
    };
  } catch (e) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

export const getPostsByUser = async (profileId: string) => {
  try {
    const posts = await queryPostsByProfile(profileId);
    return {
      status: 200,
      data: posts,
    };
  } catch (e) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

export const getCommentsByUser = async (profileId: string) => {
  try {
    const comments = await queryCommentsByProfile(profileId);
    return {
      status: 200,
      data: comments,
    };
  } catch (e) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

export const putProfile = async (profileId: string, data: UpdateProfile) => {
  try {
    await updateProfile(profileId, data);
    return {
      status: 200,
      message: "Profile updated",
    };
  } catch (e) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};
