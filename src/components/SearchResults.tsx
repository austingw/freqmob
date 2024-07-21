import { Flex, Modal, Pagination } from "@mantine/core";
import Post from "./Post";
import PostCard from "./PostCard";
import { useState } from "react";
import { PostWithMedia, boards } from "@/db/schema";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { UserLike } from "@/types/userTypes";
import { useGetPostsBySearchTerm } from "@/queries/posts";

interface SearchResultsProps {
  initialPosts: PostWithMedia[] | null;
  initialBoards: (typeof boards.$inferSelect)[] | null;
  initialLikes: UserLike[] | null;
  count: number;
  searchTerm: string;
}

const SearchResults = ({
  initialPosts,
  initialBoards,
  initialLikes,
  count,
  searchTerm,
}: SearchResultsProps) => {
  const [selectedPost, setSelectedPost] = useState<PostWithMedia | null>(null);
  const [sortValue, setSortValue] = useState<SortOptions>("new");
  const [page, setPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { data } = useGetPostsBySearchTerm(
    initialPosts,
    searchTerm,
    page,
    sortValue as SortOptions,
  );

  const handleClickPost = (postId: number) => {
    const post = data?.find((post) => post.posts.id === postId);
    post && setSelectedPost(post);
    open();
  };

  const handleClose = () => {
    setSelectedPost(null);
    close();
  };

  return (
    <>
      <Flex
        direction={"column"}
        align={"center"}
        justify={"center"}
        gap={16}
        w="100%"
        h="100%"
      >
        {data?.map((post) => {
          return (
            <PostCard
              key={post.posts.id}
              clickPost={() => handleClickPost(post.posts.id)}
              userLike={
                initialLikes?.filter(
                  (like) => like.postId === post.posts.id,
                )[0] || null
              }
              post={post}
            />
          );
        })}
        <Pagination
          total={count / 10 >= 1 ? Math.ceil(count / 10) : 1}
          value={page}
          onChange={setPage}
          hideWithOnePage
        />
      </Flex>
      <Modal
        opened={opened}
        onClose={handleClose}
        size="calc(100vw - 3rem)"
        withCloseButton={false}
        fullScreen={isMobile}
        padding={0}
      >
        {selectedPost && (
          <Post
            clickClose={handleClose}
            userLike={
              initialLikes?.filter(
                (like) => like.postId === selectedPost.posts.id,
              )[0] || null
            }
            post={selectedPost}
          />
        )}
      </Modal>
    </>
  );
};

export default SearchResults;
