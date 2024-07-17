"use client";

import { CommentWithPost, PostWithMedia, profiles } from "@/db/schema";
import {
  ActionIcon,
  Avatar,
  Flex,
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
import ProfileDetails from "./ProfileDetails";
import {
  IconBrandBandcamp,
  IconBrandSoundcloud,
  IconBrandSpotify,
  IconLink,
} from "@tabler/icons-react";

type Segment = "posts" | "comments";

interface ProfileContentProps {
  profile: typeof profiles.$inferSelect;
  posts: PostWithMedia[] | null;
  postCount: number;
  comments: CommentWithPost[] | null;
  commentCount: number;
  initialLikes: UserLike[] | null;
}

const ProfileContent = ({
  profile,
  posts,
  postCount,
  comments,
  commentCount,
  initialLikes,
}: ProfileContentProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [selectedPost, setSelectedPost] = useState<PostWithMedia | null>(null);
  const [segment, setSegment] = useState<Segment>("posts");
  const [postPage, setPostPage] = useState(1);

  const [commentPage, setCommentPage] = useState(1);

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
      <Flex direction="row" align="center" justify="space-between">
        <Group align="center" justify="center">
          {
            <Avatar
              src={profile?.avatar}
              color={theme.primaryColor}
              alt={`${profile?.name}'s avatar`}
            />
          }
          <Text fz={"h1"} c="black" fw={600}>
            u/{profile?.name}
          </Text>
          {profile?.website && (
            <ActionIcon
              variant="subtle"
              onClick={() => {
                //if statement due to typescript not narrowing type in onClick closure
                if (profile.website) {
                  window.open(String(profile.website), "_blank");
                }
              }}
            >
              <IconLink />
            </ActionIcon>
          )}
          {profile?.spotify && (
            <ActionIcon
              variant="subtle"
              onClick={() => {
                if (profile.spotify) {
                  window.open(profile.spotify, "_blank");
                }
              }}
            >
              <IconBrandSpotify />
            </ActionIcon>
          )}
          {profile?.spotify && (
            <ActionIcon
              variant="subtle"
              onClick={() => {
                if (profile.soundcloud) {
                  window.open(profile.soundcloud, "_blank");
                }
              }}
            >
              <IconBrandSoundcloud />
            </ActionIcon>
          )}
          {profile?.bandcamp && (
            <ActionIcon
              variant="subtle"
              onClick={() => {
                if (profile.bandcamp) {
                  window.open(profile.bandcamp, "_blank");
                }
              }}
            >
              <IconBrandBandcamp />
            </ActionIcon>
          )}
        </Group>
        <SegmentedControl
          color={theme.primaryColor}
          w={isMobile ? "100%" : "300px"}
          data={["details", "posts", "comments"]}
          value={segment}
          onChange={(value) => setSegment(value as Segment)}
        />
      </Flex>
      {segment === "details" && (
        <Stack>
          <ProfileDetails
            profile={profile}
            postCount={postCount}
            commentCount={commentCount}
          />
        </Stack>
      )}
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
            total={postCount / 10 >= 1 ? postCount / 10 : 1}
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
            total={commentCount / 10 >= 1 ? commentCount / 10 : 1}
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
