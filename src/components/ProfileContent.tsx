"use client";

import { CommentWithPost, PostWithMedia, profiles } from "@/lib/db/schema";
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
import {
  IconBrandBandcamp,
  IconBrandSoundcloud,
  IconBrandSpotify,
  IconLink,
} from "@tabler/icons-react";
import { useGetPostsByProfile } from "@/queries/posts";
import { useGetCommentsByProfile } from "@/queries/comments";
import { useRouter } from "next/navigation";

type Segment = "posts" | "comments";

interface ProfileContentProps {
  profile: typeof profiles.$inferSelect;
  initialPosts: PostWithMedia[] | null;
  postCount: number;
  initialComments: CommentWithPost[] | null;
  commentCount: number;
  initialLikes: UserLike[] | null;
}

const ProfileContent = ({
  profile,
  initialPosts,
  postCount,
  initialComments,
  commentCount,
  initialLikes,
}: ProfileContentProps) => {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [selectedPost, setSelectedPost] = useState<PostWithMedia | null>(null);
  const [segment, setSegment] = useState<Segment>("posts");
  const [postPage, setPostPage] = useState(1);
  const [commentPage, setCommentPage] = useState(1);

  const { data: posts } = useGetPostsByProfile(
    initialPosts,
    postPage,
    profile.id,
  );

  const { data: comments } = useGetCommentsByProfile(
    initialComments,
    commentPage,
    profile.id,
  );

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
      <Flex
        direction={isMobile ? "column" : "row"}
        align="center"
        justify="space-between"
      >
        <Flex
          direction={isMobile ? "column" : "row"}
          align="center"
          justify="center"
          gap={isMobile ? 0 : 4}
        >
          <Flex
            direction={isMobile ? "column" : "row"}
            align="center"
            justify="center"
            gap={isMobile ? 0 : 8}
          >
            <Avatar
              src={profile?.avatar}
              color={theme.primaryColor}
              name={profile?.name}
              alt={`${profile?.name}'s avatar`}
              size={"lg"}
            />
            <Text fz={"h1"} c="black" fw={600}>
              u/{profile?.name}
            </Text>
          </Flex>
          <Group align="center" justify="center" gap={8} pb={isMobile ? 8 : 0}>
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
            {profile?.soundcloud && (
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
        </Flex>
        <SegmentedControl
          color={theme.primaryColor}
          w={isMobile ? "100%" : "300px"}
          data={[
            {
              label: `${postCount} post` + (postCount === 1 ? "" : "s"),
              value: "posts",
            },
            {
              label: `${commentCount} comment` + (postCount === 1 ? "" : "s"),
              value: "comments",
            },
          ]}
          value={segment}
          onChange={(value) => setSegment(value as Segment)}
        />
      </Flex>
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
            total={postCount / 10 >= 1 ? Math.ceil(postCount / 10) : 1}
            value={postPage}
            onChange={setPostPage}
            hideWithOnePage
          />
        </Stack>
      )}
      {segment === "comments" && (
        <Stack align={"center"} justify={"center"} gap={16} w="100%" h="100%">
          {comments?.map((comment) => {
            return (
              <CommentCard
                key={comment.comments.id}
                clickPost={() =>
                  router.push(`/post/${comment.comments.postId}`)
                }
                comment={comment}
                name={profile?.name}
              />
            );
          })}
          <Pagination
            total={commentCount / 10 >= 1 ? Math.ceil(commentCount / 10) : 1}
            value={commentPage}
            onChange={setCommentPage}
            hideWithOnePage
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
