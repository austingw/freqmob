"use server";

import Feed from "@/components/Feed";
import { validateRequest } from "@/db/auth";
import { queryBoardByName } from "@/utils/operations/boardDbOperations";
import { queryPostsByBoard } from "@/utils/operations/postDbOperations";
import {
  addBoardSub,
  getProfileFromUserId,
  removeBoardSub,
} from "@/utils/operations/userDbOperations";

export default async function Page({ params }: { params: { board: string } }) {
  const boardData = await queryBoardByName(params.board);
  if (!boardData) {
    return {
      status: 404,
      body: "Not found",
    };
  }

  const user = await validateRequest();

  const profile = user.user ? await getProfileFromUserId(user.user.id) : null;
  const joinBoard = async () => {
    if (profile && profile[0].id) {
      await addBoardSub(profile[0].id, boardData[0].name);
    }
  };

  const leaveBoard = async () => {
    if (profile && profile[0].id) {
      await removeBoardSub(profile[0].id, boardData[0].name);
    }
  };

  const posts = boardData[0]?.id
    ? await queryPostsByBoard(1, boardData[0].id)
    : null;
  return (
    <div>
      {boardData[0]?.name ?? "Board doesn't exist :/"}
      {posts && <Feed initialPosts={posts} boardId={String(boardData[0].id)} />}
    </div>
  );
}
