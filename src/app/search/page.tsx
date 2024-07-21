import SearchResults from "@/components/SearchResults";
import { queryBoardsBySearchTerm } from "@/utils/operations/boardDbOperations";
import { queryPostsBySearchTerm } from "@/utils/operations/postDbOperations";

export default async function Page({
  searchParams,
}: {
  searchParams: { term: string };
}) {
  const posts = await queryPostsBySearchTerm(searchParams.term, 1, "new");
  const boards = await queryBoardsBySearchTerm(searchParams.term);

  return (
    <SearchResults
      initialPosts={posts}
      initialBoards={boards}
      initialLikes={null}
      count={10}
      searchTerm={searchParams.term}
    />
  );
}
