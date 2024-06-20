"use client";

import { Flex, Modal, Pagination, Text } from "@mantine/core";
import PostCard from "./PostCard";
import { useEffect, useState } from "react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { PostWithMedia } from "@/db/schema";
import Post from "./Post";
import { getPostsByBoard } from "@/app/actions";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { profileAtom } from "./FMAppShell";

interface FeedProps {
  initialPosts: PostWithMedia[] | null;
  boardId?: string;
}

const Feed = ({ initialPosts, boardId }: FeedProps) => {
  const [selectedPost, setSelectedPost] = useState<PostWithMedia | null>(null);
  const [page, setPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const profileValue = useAtomValue(profileAtom);

  const { data, isLoading } = useQuery({
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

  const handleClickLike = () => {
    console.log("like");
  };

  const handleClickComment = () => {
    console.log("comment");
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
              clickLike={handleClickLike}
              clickComment={handleClickComment}
              post={post}
            />
          );
        })}
        <Pagination total={10} value={page} onChange={setPage} />
      </Flex>
      <Modal
        opened={opened}
        onClose={handleClose}
        size="calc(100vw - 3rem)"
        withCloseButton={false}
        fullScreen={isMobile}
        padding={0}
      >
        {selectedPost && <Post clickClose={handleClose} post={selectedPost} />}
      </Modal>
    </>
  );
};

export default Feed;
