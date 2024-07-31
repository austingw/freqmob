"use server";

import { validateRequest } from "@/db/auth";
import { posts } from "@/db/schema";
import { convertImage } from "@/utils/convertImage";
import { getPresignedUrl } from "@/utils/getPresignedUrl";
import { insertAudio } from "@/utils/operations/audioDbOperations";
import { queryBoardByName } from "@/utils/operations/boardDbOperations";
import { insertImage } from "@/utils/operations/imageDbOperations";
import {
  insertPost,
  queryPosts,
  queryPostsByBoard,
  queryPostsBySearchTerm,
} from "@/utils/operations/postDbOperations";
import { getProfileFromUserId } from "@/utils/operations/userDbOperations";

export const createPost = async (post: FormData) => {
  const title = String(post.get("title"));
  const description = String(post.get("description"));
  const audioFile = post.get("audioFile") as Blob;
  const imageFile = post.get("imageFile") as Blob;
  const typeString = String(post.get("type"));
  const type = posts.type.enumValues.filter((t) => t === typeString)[0];
  const boardName = String(post.get("boardName"));

  if (!boardName || !title || !type) {
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

  if (!profile[0]) {
    return {
      status: 500,
      message: "There was an error creating the post",
    };
  }

  //posts.type.enumValues[5] is the type for text posts
  if (type !== posts.type.enumValues[5] && !audioFile) {
    return {
      status: 400,
      message: "Missing audio file",
    };
  }

  const boardData = await queryBoardByName(boardName);

  let imageId;
  if (imageFile && type !== posts.type.enumValues[5]) {
    const buffer = await imageFile.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);
    const resizedImage = await convertImage(imageBuffer, 300);
    try {
      const presignedUrl = await getPresignedUrl();
      const res = await fetch(presignedUrl, {
        method: "PUT",
        body: resizedImage,
        headers: {
          "Content-Type": "image/jpeg",
          "Content-Disposition": `attachment; filename="${title}_cover"`,
        },
      });
      const imgUrl = res.url.split("?")[0];

      imageId = await insertImage({
        url: imgUrl,
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

  let audioId;
  if (audioFile && type !== posts.type.enumValues[5]) {
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
    const post = await insertPost({
      title,
      description,
      type,
      published: true,
      profileId: profile[0].id,
      audioId: audioId ? audioId[0].id : null,
      imageId: imageId ? imageId[0].id : null,
      boardId: boardData[0].id,
    });

    return {
      status: 201,
      message: "Post created",
      data: {
        title,
        boardId: boardData[0].id,
        postId: post[0].id,
        profileId: profile[0].id,
      },
    };
  } catch (e) {
    return { status: 500, message: "There was an error creating the post" };
  }
};

export const getPostsByBoard = async (
  page: number,
  sort: SortOptions,
  boardId?: number,
) => {
  try {
    if (!boardId) {
      return await queryPosts(page, sort);
    }
    return await queryPostsByBoard(boardId, page, sort);
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getPostsBySearchTerm = async (
  searchTerm: string,
  page: number,
  sort: SortOptions,
) => {
  try {
    return await queryPostsBySearchTerm(searchTerm, page, sort);
  } catch (e) {
    console.error(e);
    return null;
  }
};
