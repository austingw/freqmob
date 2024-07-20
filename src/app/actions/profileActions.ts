"use server";

import { validateRequest } from "@/db/auth";
import { convertImage } from "@/utils/convertImage";
import { getPresignedUrl } from "@/utils/getPresignedUrl";
import { queryCommentsByProfile } from "@/utils/operations/commentDbOperations";
import { queryPostsByProfile } from "@/utils/operations/postDbOperations";
import {
  getProfileFromUserId,
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

export const putProfile = async (profileId: string, data: FormData) => {
  const imageFile = data.get("imageFile") as Blob;
  const currentAvatar = String(data.get("currentAvatar"));
  const website = String(data.get("website"));
  const spotify = String(data.get("spotify"));
  const soundcloud = String(data.get("soundcloud"));
  const bandcamp = String(data.get("bandcamp"));

  if (!profileId || !data) {
    return {
      status: 400,
      message: "Missing required fields",
    };
  }

  const user = await validateRequest();
  if (!user.user || !user.session) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }

  const profile = await getProfileFromUserId(user.user.id);
  if (profile[0].id !== profileId) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }

  let avatarUrl;
  if (imageFile) {
    const buffer = await imageFile.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);
    const resizedImage = await convertImage(imageBuffer, 150);
    try {
      const presignedUrl = await getPresignedUrl();
      const res = await fetch(presignedUrl, {
        method: "PUT",
        body: resizedImage,
        headers: {
          "Content-Type": "image/jpeg",
          "Content-Disposition": `attachment; filename="${profile[0].name}_avatar"`,
        },
      });
      avatarUrl = res.url.split("?")[0];
    } catch (e) {
      console.error(e);
      return {
        status: 500,
        message: "There was an upload issue, please try again later",
      };
    }
  }

  try {
    const updatedProfile = await updateProfile(profileId, {
      avatar: imageFile && avatarUrl ? avatarUrl : currentAvatar,
      website:
        !website || website === "" || website === "null" ? null : website,
      spotify:
        !spotify || spotify === "" || website === "null" ? null : spotify,
      soundcloud:
        !soundcloud || soundcloud === "" || soundcloud === "null"
          ? null
          : soundcloud,
      bandcamp:
        !bandcamp || bandcamp === "" || bandcamp === "null" ? null : bandcamp,
    });
    console.log("q+", updatedProfile);
    return {
      status: 201,
      message: "Profile updated",
      data: updatedProfile,
    };
  } catch (e) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};
