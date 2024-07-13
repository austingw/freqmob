"use client";

import { CommentWithPost, PostWithMedia, profiles } from "@/db/schema";
import {
  Group,
  Modal,
  Pagination,
  SegmentedControl,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
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
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [selectedPost, setSelectedPost] = useState<PostWithMedia | null>(null);
  const [segment, setSegment] = useState<Segment>("details");
  const [postPage, setPostPage] = useState(1);

  const [commentPage, setCommentPage] = useState(1);
  const count = 10;

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
      <Group align="center" justify="space-between">
        <Text fz={"h1"} c="black" fw={600}>
          u/{profile?.name}
        </Text>
        <SegmentedControl
          color={theme.primaryColor}
          w={isMobile ? "100%" : "300px"}
          data={["details", "posts", "comments"]}
          value={segment}
          onChange={(value) => setSegment(value as Segment)}
        />
      </Group>
      {segment === "details" && <Stack>{String(profile)}</Stack>}
      {segment === "posts" && (
        <Stack align={"center"} justify={"center"} gap={16} w="100%" h="100%">
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
          <Pagination
            total={count / 10 >= 1 ? count / 10 : 1}
            value={postPage}
            onChange={setPostPage}
          />
        </Stack>
      )}
      {segment === "comments" && (
        <Stack align={"center"} justify={"center"} gap={16} w="100%" h="100%">
          {comments?.map((comment) => {
            return (
              <CommentCard
                key={comment.comments.id}
                clickPost={() => handleClickPost(comment.comments.postId)}
                comment={comment}
                name={profile?.name}
              />
            );
          })}{" "}
          <Pagination
            total={count / 10 >= 1 ? count / 10 : 1}
            value={commentPage}
            onChange={setCommentPage}
          />
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
