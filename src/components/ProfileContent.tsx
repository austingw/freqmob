"use client";

import { CommentWithPost, PostWithMedia, profiles } from "@/db/schema";
import { Modal, SegmentedControl, Stack, useMantineTheme } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import PostCard from "./PostCard";
import { UserLike } from "@/types/userTypes";
import Post from "./Post";
import CommentCard from "./CommentCard";

type Segment = "details" | "posts" | "comments";

interface ProfileContentProps {
  profile: typeof profiles.$inferSelect;
  posts: PostWithMedia[] | null;
  comments: CommentWithPost[] | null;

  initialLikes: UserLike[] | null;
}

const ProfileContent = ({
  profile,
  posts,
  comments,
  initialLikes,
}: ProfileContentProps) => {
  const [selectedPost, setSelectedPost] = useState<PostWithMedia | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [segment, setSegment] = useState<Segment>("details");

  const handleClickPost = (postId: number) => {
    const post = posts?.find((post) => post.posts.id === postId);
    post && setSelectedPost(post);
    open();
  };

  const handleClose = () => {
    setSelectedPost(null);
    close();
  };

  return (
    <Stack>
      <SegmentedControl
        color={theme.primaryColor}
        w={isMobile ? "100%" : "300px"}
        data={["details", "posts", "comments"]}
        value={segment}
        onChange={(value) => setSegment(value as Segment)}
      />
      {segment === "details" && <Stack>{String(profile)}</Stack>}
      {segment === "posts" && (
        <Stack>
          {posts?.map((post) => {
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
        </Stack>
      )}
      {segment === "comments" && (
        <Stack>
          {comments?.map((comment) => {
            return (
              <CommentCard
                key={comment.comments.id}
                clickPost={() => handleClickPost(comment.comments.postId)}
                comment={comment}
                name={profile?.name}
              />
            );
          })}
        </Stack>
      )}
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
    </Stack>
  );
};

export default ProfileContent;
