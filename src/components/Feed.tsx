"use client"

import { Flex, Modal } from "@mantine/core";
import PostCard from "./PostCard";
import { useState } from "react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { PostWithMedia, } from "@/db/schema";

interface FeedProps {
  postList: PostWithMedia[] | null;
}

const Feed = ({ postList }: FeedProps) => {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleClickPost = (id: number) => {
    setSelectedPost(id);
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
              key={post?.id}
              url={post?.audio?.url || ""}
              art={post?.image?.url || ""}
              clickPost={() => handleClickPost(post?.id)}
              clickLike={handleClickLike}
              clickComment={handleClickComment}
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
        { // <Post post={testPosts[0]!} />
        }
      </Modal>
    </>
  );
};

export default Feed;
