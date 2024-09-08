"use client";

import {
  ActionIcon,
  Flex,
  Group,
  Text,
  Card,
  Stack,
  Badge,
  ScrollArea,
  Accordion,
  useMantineTheme,
  rem,
  Skeleton,
  Tooltip,
  Modal,
  Button,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconHeart,
  IconLink,
  IconMessageCircle2,
  IconMinus,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import AudioPlayer from "./AudioPlayer";
import { PostWithMedia } from "@/lib/db/schema";
import CommentForm from "./CommentForm";
import { useGetCommentCount, useGetComments } from "@/queries/comments";
import { useEffect, useState } from "react";
import { useGetLikeCount, useGetUserLike } from "@/queries/likes";
import { useAtomValue } from "jotai";
import { profileAtom } from "./FMAppShell";
import { useQueryClient } from "@tanstack/react-query";
import { UserLike } from "@/types/userTypes";
import { toggleLike } from "@/app/actions/likeActions";
import { useRouter } from "next/navigation";
import Comment from "./Comment";
import { delPost } from "@/app/actions/postActions";

interface PostProps {
  clickClose: () => void;
  hideClose?: boolean;
  userLike: UserLike | null;
  post: PostWithMedia;
}

const Post = ({ clickClose, hideClose, userLike, post }: PostProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [value, setValue] = useState<string | null>(null);
  const theme = useMantineTheme();
  const queryClient = useQueryClient();
  const profileValue = useAtomValue(profileAtom);
  const [tempLike, setTempLike] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);

  const { data } = useGetUserLike(
    post.posts.id,
    profileValue?.id,
    userLike,
    false,
  );

  const router = useRouter();

  useEffect(() => {
    setTempLike(data?.liked || false);
  }, [data]);

  const { data: likeCount } = useGetLikeCount(
    post.posts.id,
    post.posts.likeCount,
  );
  const { data: commentCount } = useGetCommentCount(
    post.posts.id,
    post.posts.commentCount,
  );
  const { data: comments, isLoading } = useGetComments(post.posts.id);
  return (
    <>
      <ScrollArea.Autosize scrollbarSize={10}>
        <Card radius="md" w={"100%"} shadow="sm" pt={!hideClose ? 0 : 8}>
          {!hideClose && (
            <ActionIcon
              variant="subtle"
              color="gray"
              radius="xl"
              size="sm"
              onClick={() => {
                clickClose();
              }}
              style={{
                position: "absolute",
                top: 15,
                right: 15,
                zIndex: 999,
              }}
            >
              <IconX />
            </ActionIcon>
          )}

          {post?.audio?.url && (
            <Card.Section>
              <Flex justify={"center"} align={"center"}>
                <AudioPlayer
                  url={post?.audio?.url || ""}
                  art={post?.images?.url || ""}
                />
              </Flex>
            </Card.Section>
          )}
          <Stack gap={4}>
            <Flex
              direction={isMobile ? "column" : "row"}
              align={isMobile ? "flex-start" : "center"}
              justify={isMobile ? "center" : "space-between"}
              gap={isMobile ? 10 : 0}
              pb={isMobile ? 10 : 0}
              pt={!post?.audio?.url ? 10 : 0}
            >
              <Text fz="xl" fw={600}>
                {post?.posts?.title}
              </Text>
              <Button
                variant="transparent"
                size="compact-sm"
                p={0}
                c="dimmed"
                onClick={() => {
                  router.push(`/fm/${post?.boards?.name}`);
                }}
              >
                {`fm/${post.boards.name}`}
              </Button>
            </Flex>

            {post.posts.description && (
              <Text fz="sm" c="dimmed" w={"100%"}>
                {post.posts.description}
              </Text>
            )}
            <Group align="flex-start" justify="space-between" py={10}>
              <Group gap={"xs"} align="center">
                <Badge
                  variant="gradient"
                  gradient={{ from: "cool-blue", to: "wild-pink" }}
                  style={{
                    minWidth: "fit-content",
                    position: "relative",
                  }}
                >
                  {post.posts.type}
                </Badge>
                <Group gap={4} align="center">
                  <ActionIcon
                    color={theme.primaryColor}
                    variant={tempLike ? "filled" : "subtle"}
                    size={"sm"}
                    onClick={async () => {
                      if (profileValue?.id) {
                        setTempLike((tempLike) => !tempLike);
                        await toggleLike(post.posts.id, profileValue?.id)
                          .catch()
                          .then(() => {
                            queryClient.invalidateQueries({
                              queryKey: [
                                "userLike",
                                post.posts.id,
                                profileValue.id,
                                true,
                              ],
                            });
                            queryClient.invalidateQueries({
                              queryKey: ["likeCount", post.posts.id],
                            });
                          });
                      }
                    }}
                  >
                    <IconHeart style={{ width: rem(16), height: rem(16) }} />
                  </ActionIcon>
                  <Text fz="xs" c="dimmed">
                    {likeCount || 0} {likeCount === 1 ? "like" : "likes"}
                  </Text>
                </Group>
                <Group gap={4} align="center" variant="subtle">
                  <ActionIcon
                    color={theme.primaryColor}
                    size={"sm"}
                    variant="subtle"
                    style={{
                      cursor: "default",
                    }}
                  >
                    <IconMessageCircle2 />
                  </ActionIcon>
                  <Text fz="xs" c="dimmed">
                    {commentCount || 0}{" "}
                    {commentCount === 1 ? "comment" : "comments"}
                  </Text>
                </Group>
                <Tooltip
                  opened={showTooltip}
                  label="Link copied!"
                  position="top"
                  color={theme.primaryColor}
                  withArrow
                >
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/post/${post.posts.id}`,
                      );
                      setShowTooltip(true);
                      setTimeout(() => {
                        setShowTooltip(false);
                      }, 1000);
                    }}
                  >
                    <IconLink />
                  </ActionIcon>
                </Tooltip>
                {/* No post editing for now, thinking through the best flow
                * profileValue?.id === post.posts.profileId && (
                  <ActionIcon variant="subtle" size="sm" onClick={() => {}}>
                    <IconPencil />
                  </ActionIcon>
                ) */}
                {profileValue?.id === post.posts.profileId && (
                  <ActionIcon variant="subtle" size="sm" onClick={open}>
                    <IconTrash />
                  </ActionIcon>
                )}

                <Group gap={"xs"} align="center">
                  {post.posts.genre && (
                    <Text fz="xs" c="dimmed">
                      Genre: <b>{post.posts.genre}</b>
                    </Text>
                  )}
                  {post.posts.bpm && (
                    <Text fz="xs" c="dimmed">
                      BPM: <b>{post.posts.bpm}</b>
                    </Text>
                  )}
                  {post.posts.key && (
                    <Text fz="xs" c="dimmed">
                      Key: <b>{post.posts.key}</b>
                    </Text>
                  )}
                  {post.posts.inspiration && (
                    <Text fz="xs" c="dimmed">
                      Influences: <b>{post.posts.inspiration}</b>
                    </Text>
                  )}
                </Group>
              </Group>
              <Badge
                variant="outline"
                onClick={() => {
                  router.push(`/u/${post?.profiles?.name}`);
                }}
                style={{
                  cursor: "pointer",
                  ":hover": {
                    backgroundColor: "gray",
                  },
                }}
              >
                Posted by {post.profiles.name}
              </Badge>
            </Group>

            <Accordion
              chevron={
                value ? <IconMinus size="1rem" /> : <IconPlus size="1rem" />
              }
              variant={hideClose ? "contained" : "filled"}
              value={value}
              onChange={setValue}
              styles={{
                chevron: {
                  "&[data-rotate]": {
                    transform: "rotate(45deg)",
                  },
                },
              }}
            >
              <Accordion.Item value="Add Comment">
                <Accordion.Control>Add Comment</Accordion.Control>
                <Accordion.Panel>
                  <CommentForm postId={post.posts.id} setValue={setValue} />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            {isLoading ? (
              <>
                <Skeleton w={"100%"} h={60} />
                <Skeleton w={"100%"} h={60} />
                <Skeleton w={"100%"} h={60} />
              </>
            ) : (
              comments?.map((comment) => (
                <Comment key={comment.comments.id} comment={comment} />
              ))
            )}
          </Stack>
        </Card>
      </ScrollArea.Autosize>
      <Modal
        opened={opened}
        onClose={close}
        size={"auto"}
        title={"Confirm Delete"}
        style={{
          ".mantineModalTitle": {
            fontWeight: 6000,
          },
        }}
      >
        <Stack align="flex-start" justify="center" miw={"100%"} gap={0}>
          <Text fz="sm">Are you sure you want to delete this post?</Text>
          <Text fz="sm" c="dimmed">
            This action cannot be undone.
          </Text>
          <Group align="center" justify="flex-end" w={"100%"} pt={16}>
            <Button
              onClick={async () => {
                await delPost(post.posts.id).then((res) => {
                  if (res?.status === 200) {
                    notifications.show({
                      message: "Post deleted!",
                      icon: <IconCheck />,
                      autoClose: 3000,
                    });
                    close();
                    clickClose();
                  }
                });
              }}
            >
              Confirm
            </Button>
            <Button onClick={close} variant="light">
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default Post;
