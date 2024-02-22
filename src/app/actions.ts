"use server";

import { getPresignedUrl } from "@/utils/getPresignedUrl";

export const createPost = async (prevState: any, post: FormData) => {
  const title = post.get("title");
  const file = post.get("file");

  if (file) {
    const presignedUrl = await getPresignedUrl();
    const res = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": "audio/mp3", //to be dynamic based on file type
        "Content-Disposition": `attachment; filename="${title}"`,
      },
    });
    const audioUrl = res.url.split("?")[0];
  }
};
