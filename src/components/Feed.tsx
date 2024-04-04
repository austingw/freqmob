"use client"

import { Flex, Modal } from "@mantine/core";
import PostCard from "./PostCard";
import { useState } from "react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { PostWithMedia, } from "@/db/schema";
import Post from "./Post";

interface FeedProps {
  postList: PostWithMedia[] | null;
}

const Feed = ({ postList }: FeedProps) => {
  const [selectedPost, setSelectedPost] = useState<PostWithMedia | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleClickPost = (postId: number) => {
    const post = postList?.find((post) => post.posts.id === postId);
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
        px={25}
        gap={25}
        w="100%"
        h="100%"
      >
        {postList?.map((post) => {
          return (
            <PostCard
              clickPost={() => handleClickPost(post.posts.id)}
              clickLike={handleClickLike}
              clickComment={handleClickComment}
              post={post}
            />
          );
        })
        }

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
