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
  const posts = await queryPostsByBoard(boardData[0].id);
  console.log(boardData);
  console.log(typeof posts);
  return (
    <div>
      My Post: {boardData[0].name}
    </div>
  );
}
