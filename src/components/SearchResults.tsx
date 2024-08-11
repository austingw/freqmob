"use client";

import {
  Flex,
  Group,
  Modal,
  Pagination,
  SegmentedControl,
  Text,
  useMantineTheme,
} from "@mantine/core";
import Post from "./Post";
import PostCard from "./PostCard";
import { useState } from "react";
import { PostWithMedia, boards } from "@/db/schema";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { UserLike } from "@/types/userTypes";
import { useGetPostsBySearchTerm } from "@/queries/posts";
import SortMenu from "./SortMenu";
import BoardCard from "./BoardCard";

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
  const [segment, setSegment] = useState<"posts" | "boards">("posts");
  const [page, setPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const theme = useMantineTheme();

  const { data, isLoading } = useGetPostsBySearchTerm(
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
        <Group align="center" justify="space-between" gap={16} w={"100%"}>
          <Group align="center" gap={8}>
            <Text fz="h1" fw={"bold"}>
              Results for search: {`"` + searchTerm + `"`}
            </Text>
            {segment === "posts" && (
              <SortMenu sortValue={sortValue} setSortValue={setSortValue} />
            )}
          </Group>
          <SegmentedControl
            color={theme.primaryColor}
            w={isMobile ? "100%" : "300px"}
            data={[
              {
                label: "Posts",
                value: "posts",
              },
              {
                label: "Boards",
                value: "boards",
              },
            ]}
            value={segment}
            onChange={(value) => setSegment(value as "posts" | "boards")}
          />
        </Group>
        {segment === "posts" &&
          data?.map((post) => {
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
        {segment === "posts" && data?.length === 0 && (
          <Text fz="xl" fw={600} c="dimmed">
            No posts found
          </Text>
        )}
        {segment === "posts" && (
          <Pagination
            total={count / 10 >= 1 ? Math.ceil(count / 10) : 1}
            value={page}
            onChange={setPage}
            hideWithOnePage
          />
        )}
        {segment === "boards" &&
          initialBoards?.map((board) => {
            return <BoardCard key={board.id} board={board} />;
          })}
        {segment === "boards" && initialBoards?.length === 0 && (
          <Text fz="xl" fw={600} c="dimmed">
            No boards found
          </Text>
        )}
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
