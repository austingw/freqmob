"use server";

import { getPresignedUrl } from "@/utils/getPresignedUrl";
import { insertAudio } from "@/utils/operations/audioDbOperations";
import { insertPost, queryPosts } from "@/utils/operations/postDbOperations";

export const createPost = async (post: FormData) => {
  const title = String(post.get("title"));
  const description = String(post.get("description"));
  const file = post.get("file");

  let audioId;
  if (file) {
    try {
      const presignedUrl = await getPresignedUrl();
      const res = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": "audio/mp3", //todo: add step that converts all incoming files to mp3
          "Content-Disposition": `attachment; filename="${title}"`,
        },
      });
      const audioUrl = res.url.split("?")[0];

      audioId = await insertAudio({
        url: audioUrl,
        profileId: "1",
      });
      console.log(audioId);
    } catch {
      throw new Error("There was an error uploading the file");
    }
  }

  try {
    await insertPost({
      title,
      description,
      type: "demo",
      published: true,
      profileId: "1",
      audioId: audioId ? audioId[0].id : null,
    });
  } catch {
    throw new Error("There was an error creating the post");
  }
};

export const getPosts = async () => {
  return await queryPosts();
};
