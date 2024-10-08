"use server";

import { getUserLikes } from "@/app/actions/likeActions";
import BoardHeader from "@/components/BoardHeader";
import Feed from "@/components/Feed";
import { validateRequest } from "@/lib/auth/auth";
import { queryBoardByName } from "@/lib/db/operations/boardDbOperations";
import {
  queryPostCount,
  queryPostsByBoard,
} from "@/lib/db/operations/postDbOperations";
import { getProfileFromUserId } from "@/lib/db/operations/userDbOperations";

export default async function Page({ params }: { params: { board: string } }) {
  const boardData = await queryBoardByName(params.board);
  if (!boardData[0]?.id) {
    return (
      <div>
        <h1>board does not exist (but feel free to create it!)</h1>
      </div>
    );
  }

  const posts = boardData[0]?.id
    ? await queryPostsByBoard(1, boardData[0]?.id, "new")
    : null;

  const user = await validateRequest();
  const postIds = posts ? posts.map((post) => post.posts.id) : [];
  const profile = user.user && (await getProfileFromUserId(user.user.id));
  const profileId = profile ? profile[0].id : null;
  const postLikes =
    postIds.length > 0 && profileId
      ? await getUserLikes(postIds, profileId)
      : null;

  const postCount = await queryPostCount(boardData[0]?.id)
    .catch((e) => {
      console.error(e);
    })
    .then((data) => data?.[0]?.count || 1);

  return (
    <div>
      <BoardHeader name={boardData[0]?.name} />
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
