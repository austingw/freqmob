"use server";

import { validateRequest } from "@/lib/auth/auth";
import {
  insertBoard,
  queryBoardsBySearchTerm,
} from "@/lib/db/operations/boardDbOperations";
import {
  addBoardSub,
  getProfileFromUserId,
  getUserBoards,
  removeBoardSub,
} from "@/lib/db/operations/userDbOperations";

export const joinBoard = async (profileId: string, boardName: string) => {
  try {
    await addBoardSub(profileId, boardName);
    return { status: 201, message: "Board joined" };
  } catch (e) {
    return { status: 500, message: "There was an error joining the board" };
  }
};

export const leaveBoard = async (profileId: string, boardName: string) => {
  try {
    await removeBoardSub(profileId, boardName);
    return { status: 200, message: "Board left" };
  } catch (e) {
    return { status: 500, message: "There was an error leaving the board" };
  }
};

export const getUserBoardList = async (profileId: string) => {
  try {
    const data = await getUserBoards(profileId);
    return { status: 200, data: data[0].boardList };
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const createBoard = async (name: string) => {
  if (name === "main") {
    return {
      status: 401,
      message: "Name not allowed",
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
      message: "Unable to create board",
    };
  }

  try {
    const newBoard = await insertBoard({
      name: name.toLowerCase(),
      profileId: profile[0].id,
    });

    if (newBoard) {
      await addBoardSub(profile[0].id, name.toLowerCase());
    }

    return {
      status: 201,
      message: "Successfully created new board!",
      name,
    };
  } catch (e) {
    console.error(e);
    return {
      status: 500,
      message: "Unable to create board",
    };
  }
};

export const getBoardsBySearchTerm = async (searchTerm: string) => {
  try {
    return await queryBoardsBySearchTerm(searchTerm);
  } catch (e) {
    console.error(e);
    return null;
  }
};
