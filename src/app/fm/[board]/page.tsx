"use server";

import Feed from "@/components/Feed";
import { queryBoardByName } from "@/utils/operations/boardDbOperations";
import { queryPostsByBoard } from "@/utils/operations/postDbOperations";

export default async function Page({ params }: { params: { board: string } }) {
  const boardData = await queryBoardByName(params.board);
  if (!boardData) {
    return {
      status: 404,
      body: "Not found",
    };
  }
  const posts = boardData[0]?.id
    ? await queryPostsByBoard(boardData[0].id, 1)
    : null;
  return (
    <div>
      {boardData[0]?.name ?? "Board doesn't exist :/"}
      {posts && <Feed initialPosts={posts} boardId={String(boardData[0].id)} />}
    </div>
  );
}
