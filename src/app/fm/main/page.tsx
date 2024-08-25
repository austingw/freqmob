"use server";

import { getUserLikes } from "@/app/actions/likeActions";
import BoardHeader from "@/components/BoardHeader";
import Feed from "@/components/Feed";
import { validateRequest } from "@/lib/auth/auth";
import {
  queryPostCount,
  queryPosts,
} from "@/utils/operations/postDbOperations";
import { getProfileFromUserId } from "@/utils/operations/userDbOperations";

export default async function Page() {
  const posts = await queryPosts(1, "new");

  const user = await validateRequest();
  const postIds = posts ? posts.map((post) => post.posts.id) : [];
  const profile = user.user && (await getProfileFromUserId(user.user.id));
  const profileId = profile ? profile[0].id : null;
  const postLikes =
    postIds.length > 0 && profileId
      ? await getUserLikes(postIds, profileId)
      : null;

  const postCount = await queryPostCount()
    .catch((e) => {
      console.error(e);
    })
    .then((data) => data?.[0]?.count || 1);

  return (
    <div>
      <BoardHeader name={""} />
      <Feed
        initialPosts={posts}
        initialLikes={postLikes}
        postIds={postIds}
        count={postCount}
      />
    </div>
  );
}
