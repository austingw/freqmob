"use server";

import { getUserLikes } from "@/app/actions/likeActions";
import BoardHeader from "@/components/BoardHeader";
import Feed from "@/components/Feed";
import { validateRequest } from "@/db/auth";
import { queryBoardByName } from "@/utils/operations/boardDbOperations";
import {
  queryPostCount,
  queryPostsByBoard,
} from "@/utils/operations/postDbOperations";
import { getProfileFromUserId } from "@/utils/operations/userDbOperations";

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

  const user = await validateRequest();
  const postIds = posts ? posts.map((post) => post.posts.id) : [];
  const profile = user.user && (await getProfileFromUserId(user.user.id));
  const profileId = profile ? profile[0].id : null;
  const postLikes =
    postIds.length > 0 && profileId
      ? await getUserLikes(postIds, profileId)
      : null;

  const postCount = await queryPostCount(boardData[0].id)
    .catch((e) => {
      console.error(e);
    })
    .then((data) => data?.[0]?.count || 1);

  return (
    <div>
      <BoardHeader name={boardData[0].name} />
      {posts && (
        <Feed
          initialPosts={posts}
          initialLikes={postLikes}
          boardId={String(boardData[0].id)}
          postIds={postIds}
          count={postCount}
        />
      )}
    </div>
  );
}
