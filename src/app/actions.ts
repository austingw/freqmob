"use server";

import { lucia, validateRequest } from "@/db/auth";
import { posts } from "@/db/schema";
import { getPresignedUrl } from "@/utils/getPresignedUrl";
import { insertAudio } from "@/utils/operations/audioDbOperations";
import {
  insertComment,
  queryComments,
} from "@/utils/operations/commentDbOperations";
import {
  insertPost,
  queryPosts,
  queryPostsByBoard,
} from "@/utils/operations/postDbOperations";
import {
  checkUsername,
  insertProfile,
  insertUser,
} from "@/utils/operations/userDbOperations";
import { ActionResult } from "next/dist/server/app-render/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";

export const createPost = async (post: FormData) => {
  const title = String(post.get("title"));
  const description = String(post.get("description"));
  const file = post.get("file");
  const typeString = String(post.get("type"));
  const type = posts.type.enumValues.filter((t) => t === typeString)[0];

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
        profileId: "test",
      });
    } catch {
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
      profileId: "test",
      audioId: audioId ? audioId[0].id : null,
      boardId: 1,
    });

    return { status: 201, message: "Post created" };
  } catch {
    return { status: 500, message: "There was an error creating the post" };
  }
};

export const signup = async (user: FormData) => {
  const username = String(user.get("username"));
  const password = String(user.get("password"));

  //Check if the username already exists
  if (username) {
    const usernameExists = await checkUsername(username);
    if (usernameExists[0]) {
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
      sessionCookie.attributes,
    );
  } catch {
    return {
      error: "There was an error creating the user",
    };
  }

  return redirect("/");
};

export const login = async (user: FormData) => {
  const username = String(user.get("username"));
  const password = String(user.get("password"));

  //Basic validation for username and password
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31
  ) {
    return {
      error: "Incorrect username or password1",
    };
  }

  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Incorrect username or password2",
    };
  }

  //Check if the username exists
  const existingUser = await checkUsername(username);
  if (!existingUser[0]) {
    return {
      error: "Incorrect username or password3",
    };
  }

  const passwordMatch = await new Argon2id().verify(
    existingUser[0].password,
    password,
  );
  if (!passwordMatch) {
    return {
      error: "Incorrect username or password4",
    };
  }

  const session = await lucia.createSession(existingUser[0].id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
};

export const logout = async (): Promise<ActionResult> => {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/login");
};

export const createComment = async (comment: FormData) => {
  console.log("this is reaching", comment);

  const postId = String(comment.get("postId"));
  const content = String(comment.get("content"));

  try {
    await insertComment({
      postId,
      content,
      profileId: "test",
    });
    return { status: 201, message: "Comment created" };
  } catch {
    throw new Error("There was an error creating the comment");
  }
};

export const getComments = async (postId: string) => {
  return await queryComments(postId);
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
