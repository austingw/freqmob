"use server";

import BoardHeader from "@/components/BoardHeader";
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
    ? await queryPostsByBoard(1, boardData[0].id)
    : null;
  return (
    <div>
      <BoardHeader name={boardData[0].name} />
      {posts && <Feed initialPosts={posts} boardId={String(boardData[0].id)} />}
    </div>
  );
}
