"use server";

import { getUserLikes } from "@/app/actions/likeActions";
import ProfileContent from "@/components/ProfileContent";
import { validateRequest } from "@/lib/auth/auth";
import {
  queryCommentCountByProfileId,
  queryCommentsByProfile,
} from "@/lib/db/operations/commentDbOperations";
import {
  queryPostCountByProfileId,
  queryPostsByProfile,
} from "@/lib/db/operations/postDbOperations";
import {
  getProfileFromUserId,
  getProfileFromUsername,
} from "@/lib/db/operations/userDbOperations";

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const profile = await getProfileFromUsername(params?.username);

  if (!profile[0]?.name) {
    return (
      <div>
        <h1>User not found</h1>
      </div>
    );
  }

  const posts = await queryPostsByProfile(profile[0]?.id);
  const postCount = await queryPostCountByProfileId(profile[0]?.id);
  const comments = await queryCommentsByProfile(profile[0]?.id);
  const commentCount = await queryCommentCountByProfileId(profile[0]?.id);

  const postIds = posts ? posts.map((post) => post.posts.id) : [];

  //call for the user that is logged in
  const user = await validateRequest();
  const userProfile = user.user && (await getProfileFromUserId(user.user.id));
  const userProfileId = userProfile ? userProfile[0].id : null;
  const postLikes =
    postIds.length > 0 && userProfileId
      ? await getUserLikes(postIds, userProfileId)
      : null;

  return (
    <div>
      <ProfileContent
        profile={profile[0]}
        posts={posts}
        postCount={postCount?.[0]?.count || 0}
        comments={comments}
        commentCount={commentCount?.[0]?.count || 0}
        initialLikes={postLikes}
      />
    </div>
  );
}
