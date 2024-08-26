import { getUserLikes } from "@/app/actions/likeActions";
import PostWrapper from "@/components/PostWrapper";
import { validateRequest } from "@/lib/auth/auth";
import { queryPostById } from "@/lib/db/operations/postDbOperations";
import { getProfileFromUserId } from "@/lib/db/operations/userDbOperations";

export default async function Page({ params }: { params: { id: number } }) {
  const post = await queryPostById(params?.id);
  const user = await validateRequest();
  const profile = user.user && (await getProfileFromUserId(user.user.id));
  const profileId = profile ? profile[0].id : null;
  const postLikes =
    post && profileId
      ? await getUserLikes([post?.[0]?.posts.id], profileId)
      : null;

  return (
    <div>
      <PostWrapper post={post?.[0]} userLike={postLikes?.[0] || null} />
    </div>
  );
}
