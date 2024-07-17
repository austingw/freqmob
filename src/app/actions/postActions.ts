"use server";

import { validateRequest } from "@/db/auth";
import { posts } from "@/db/schema";
import { getPresignedUrl } from "@/utils/getPresignedUrl";
import { insertAudio } from "@/utils/operations/audioDbOperations";
import { queryBoardByName } from "@/utils/operations/boardDbOperations";
import {
  insertPost,
  queryPosts,
  queryPostsByBoard,
} from "@/utils/operations/postDbOperations";
import { getProfileFromUserId } from "@/utils/operations/userDbOperations";
import sharp from "sharp";

export const createPost = async (post: FormData) => {
  const title = String(post.get("title"));
  const description = String(post.get("description"));
  const audioFile = post.get("audioFile");
  const imageFile = post.get("imageFile");
  const typeString = String(post.get("type"));
  const type = posts.type.enumValues.filter((t) => t === typeString)[0];
  const boardName = String(post.get("boardName"));

  console.log(audioFile, imageFile);
  const user = await validateRequest();

  if (!user.user || !user.session) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }

  const profile = await getProfileFromUserId(user.user.id);

  if (!profile[0]) {
    return {
      status: 500,
      message: "There was an error creating the post",
    };
  }

  const boardData = await queryBoardByName(boardName);

  let audioId;
  if (audioFile) {
    try {
      const presignedUrl = await getPresignedUrl();
      const res = await fetch(presignedUrl, {
        method: "PUT",
        body: audioFile,
        headers: {
          "Content-Type": "audio/mp3", //todo: add step that converts all incoming files to mp3
          "Content-Disposition": `attachment; filename="${title}"`,
        },
      });
      const audioUrl = res.url.split("?")[0];

      audioId = await insertAudio({
        url: audioUrl,
        profileId: profile[0].id,
      });
    } catch (e) {
      console.error(e);
      return {
        status: 500,
        message: "There was an upload issue, please try again later",
      };
    }
  }

  try {
    await insertPost({
      title,
      description,
      type,
      published: true,
      profileId: profile[0].id,
      audioId: audioId ? audioId[0].id : null,
      boardId: boardData[0].id,
    });

    return { status: 201, message: "Post created" };
  } catch (e) {
    return { status: 500, message: "There was an error creating the post" };
  }
};

export const getPostsByBoard = async (page: number, boardId?: number) => {
  try {
    if (!boardId) {
      return await queryPosts(page);
    }
    return await queryPostsByBoard(boardId, page);
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const convertImage = async (photo: FormData) => {
  const pic = photo.get("photo") as Blob;
  const buffer = await pic.arrayBuffer();
  const photoBuffer = Buffer.from(buffer);
  const upload = await sharp(photoBuffer).resize(200, 200).toFile("art.jpeg");
  console.log(upload);
};
