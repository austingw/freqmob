"use server";

import {
  createPasswordResetToken,
  lucia,
  validateRequest,
} from "@/lib/auth/auth";
import {
  checkUsername,
  deletePasswordToken,
  insertProfile,
  insertUser,
  queryPasswordToken,
  updatePassword,
} from "@/lib/db/operations/userDbOperations";
import sendPasswordResetEmail from "@/lib/email/sendPasswordResetEmail";
import { ActionResult } from "next/dist/server/app-render/types";
import { cookies } from "next/headers";
import { isWithinExpirationDate } from "oslo";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";

import { hash, verify } from "@node-rs/argon2";

export const signup = async (user: FormData) => {
  const username = String(user.get("username"));
  const email = String(user.get("email"));
  const password = String(user.get("password"));
  const password2 = String(user.get("password2"));

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

  if (password !== password2) {
    return {
      error: "Passwords do not match",
    };
  }

  try {
    const hashedPassword = await hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (hashedPassword === "") {
      return {
        error: "Password broken :/",
      };
    }

    //Now we can insert the user
    const newUser = await insertUser({
      username,
      email: email || null,
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
  } catch (e) {
    console.error(e);
    return {
      error: "Error creating profile, please try again later",
    };
  }

  return;
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

  const passwordMatch = await verify(existingUser[0].password, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
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
  return;
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
  return;
};

export const sendPasswordResetToken = async (data: FormData) => {
  const username = String(data.get("username"));
  const origin = String(data.get("origin"));
  const user = await checkUsername(username);

  if (!user || !user[0].email) {
    return { message: "No email associated with account", status: 400 };
  }

  const verificationToken = await createPasswordResetToken(user[0].id);
  const verificationLink = origin + "/reset-password/" + verificationToken;

  const res = await sendPasswordResetEmail(user[0].email, verificationLink);
  console.log(res);

  if (!res) {
    return {
      message:
        "There was an error sending the email, please try again later or contact fm@freqmob.com directly",
      status: 500,
    };
  }

  return { message: "Email sent", status: 200 };
};

export const postNewPassword = async (
  verificationToken: string,
  input: FormData,
) => {
  const password = String(input.get("password"));
  const password2 = String(input.get("password2"));

  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      message: "Invalid password",
      status: 400,
    };
  }

  if (password !== password2) {
    return {
      message: "Passwords do not match",
      status: 400,
    };
  }

  const tokenHash = encodeHex(
    await sha256(new TextEncoder().encode(verificationToken)),
  );
  const token = await queryPasswordToken(tokenHash);
  const expirationDate = new Date(token[0].expiresAt);

  if (token[0]) {
    await deletePasswordToken(tokenHash);
  }

  if (!token || !token[0] || !isWithinExpirationDate(expirationDate)) {
    return { message: "Invalid token", status: 400 };
  }

  const hashedPassword = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  await updatePassword(token[0].userId, hashedPassword);

  const session = await lucia.createSession(token[0].userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return { message: "Password updated", status: 200 };
};
