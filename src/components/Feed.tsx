"use client";

import { Flex, Modal, Pagination } from "@mantine/core";
import PostCard from "./PostCard";
import { useState } from "react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { PostWithMedia } from "@/db/schema";
import Post from "./Post";
import { getPostsByBoard } from "@/app/actions";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { UserLike } from "@/types/userTypes";

interface FeedProps {
  initialPosts: PostWithMedia[] | null;
  initialLikes: UserLike[] | null;
  boardId?: string;
  postIds: number[];
  count: number;
}

const Feed = ({ initialPosts, initialLikes, boardId, count }: FeedProps) => {
  const [selectedPost, setSelectedPost] = useState<PostWithMedia | null>(null);
  const [page, setPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { data } = useQuery({
    queryKey: ["posts", boardId, page],
    queryFn: () => getPostsByBoard(page, Number(boardId)),
    initialData: initialPosts,
    staleTime: 0,
    placeholderData: keepPreviousData,
  });

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
        gap={25}
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
          total={count / 10 >= 1 ? count / 10 : 1}
          value={page}
          onChange={setPage}
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

export default Feed;
