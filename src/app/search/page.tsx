import SearchResults from "@/components/SearchResults";
import { validateRequest } from "@/lib/auth/auth";
import { queryBoardsBySearchTerm } from "@/utils/operations/boardDbOperations";
import {
  queryPostsBySearchTerm,
  queryPostsCountBySearchTerm,
} from "@/utils/operations/postDbOperations";
import { getProfileFromUserId } from "@/utils/operations/userDbOperations";
import { getUserLikes } from "../actions/likeActions";

export default async function Page({
  searchParams,
}: {
  searchParams: { term: string };
}) {
  const posts = await queryPostsBySearchTerm(searchParams.term, 1, "new");
  const boards = await queryBoardsBySearchTerm(searchParams.term);

  const user = await validateRequest();
  const postIds = posts ? posts.map((post) => post.posts.id) : [];
  const profile = user.user && (await getProfileFromUserId(user.user.id));
  const profileId = profile ? profile[0].id : null;
  const postLikes =
    postIds.length > 0 && profileId
      ? await getUserLikes(postIds, profileId)
      : null;
  const postCount = await queryPostsCountBySearchTerm(searchParams.term)
    .catch((e) => {
      console.error(e);
    })
    .then((data) => data?.[0]?.count || 1);

  return (
    <SearchResults
      initialPosts={posts}
      initialBoards={boards}
      initialLikes={postLikes}
      count={postCount}
      searchTerm={searchParams.term}
    />
  );
}
