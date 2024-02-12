import { Flex, Modal } from "@mantine/core";
import PostCard from "./PostCard";
import { useState } from "react";
import Post from "./Post";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

const Feed = () => {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const testPosts = [
    {
      id: 1,
      url: "https://xntslrrernpkzvgsuipl.supabase.co/storage/v1/object/sign/Audio/Two%20Pillars(7).wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJBdWRpby9Ud28gUGlsbGFycyg3KS53YXYiLCJpYXQiOjE2OTQ5ODU3OTUsImV4cCI6MTcyNjUyMTc5NX0.2jcTsYUzbSXxLKnrxpzgpB0dYxqhVymprddFt80e39g&t=2023-09-17T21%3A23%3A15.979Z",
      art: "",
      title: "Two Pillars",
    },
    {
      id: 2,
      url: "https://xntslrrernpkzvgsuipl.supabase.co/storage/v1/object/sign/Audio/Two%20Pillars(7).wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJBdWRpby9Ud28gUGlsbGFycyg3KS53YXYiLCJpYXQiOjE2OTQ5ODU3OTUsImV4cCI6MTcyNjUyMTc5NX0.2jcTsYUzbSXxLKnrxpzgpB0dYxqhVymprddFt80e39g&t=2023-09-17T21%3A23%3A15.979Z",
      art: "",
    },
    {
      id: 3,
      url: "https://xntslrrernpkzvgsuipl.supabase.co/storage/v1/object/sign/Audio/Two%20Pillars(7).wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJBdWRpby9Ud28gUGlsbGFycyg3KS53YXYiLCJpYXQiOjE2OTQ5ODU3OTUsImV4cCI6MTcyNjUyMTc5NX0.2jcTsYUzbSXxLKnrxpzgpB0dYxqhVymprddFt80e39g&t=2023-09-17T21%3A23%3A15.979Z",
      art: "",
    },
  ];

  const handleClickPost = () => {
    // setSelectedPost(id);
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
        {testPosts?.map((post) => {
          return (
            <PostCard
              key={post?.id}
              url={post?.url}
              art={post?.art}
              clickPost={handleClickPost}
              clickLike={handleClickLike}
              clickComment={handleClickComment}
            />
          );
        })}
      </Flex>
      <Modal
        opened={opened}
        onClose={close}
        size="calc(100vw - 3rem)"
        withCloseButton={false}
        fullScreen={isMobile}
        padding={0}
      >
        <Post post={testPosts[0]!} />
      </Modal>
    </>
  );
};

export default Feed;
