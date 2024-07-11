"use server";

import ProfileContent from "@/components/ProfileContent";
import ProfileHeader from "@/components/ProfileHeader";
import { queryCommentsByProfile } from "@/utils/operations/commentDbOperations";
import { queryPostsByProfile } from "@/utils/operations/postDbOperations";
import { getProfileFromUsername } from "@/utils/operations/userDbOperations";

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
  const comments = await queryCommentsByProfile(profile[0]?.id);

  console.log(profile, posts, comments);

  return (
    <div>
      <ProfileHeader profile={profile[0]} />
      <ProfileContent posts={posts} comments={comments} />
    </div>
  );
}
