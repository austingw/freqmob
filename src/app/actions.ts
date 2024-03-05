"use server";

import { lucia } from "@/db/auth";
import { db } from "@/db/db";
import { getPresignedUrl } from "@/utils/getPresignedUrl";
import { insertAudio } from "@/utils/operations/audioDbOperations";
import { insertPost, queryPosts } from "@/utils/operations/postDbOperations";
import {
  checkUsername,
  insertProfile,
  insertUser,
} from "@/utils/operations/userDbOperations";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";

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

export const signup = async (user: FormData) => {
  const username = String(user.get("username"));
  const password = user.get("password");

  //Check if the username already exists
  if (username) {
    const usernameExists = await checkUsername(username);
    if (usernameExists.length) {
      console.log(usernameExists);
      return {
        error: "Username already exists",
      };
    }
  }

  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    console.log("Invalid password");
    return {
      error: "Invalid password",
    };
  }

  //Hash that jawn
  const hashedPassword = await new Argon2id().hash(password);

  //Now we can insert the user
  try {
    const newUser = await insertUser({
      username,
      password: hashedPassword,
    });
    console.log(newUser);
    //Create a public-facing profile to be updated later during onboarding
    await insertProfile({
      userId: newUser[0].id,
      name: username,
    });

    //Create a session for the new user using Lucia
    const session = await lucia.createSession(newUser[0].id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return redirect("/");
  } catch {
    return {
      error: "There was an error creating the user",
    };
  }
};
