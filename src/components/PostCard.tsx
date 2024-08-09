import { IconHeart, IconLink, IconMessageCircle2 } from "@tabler/icons-react";
import {
  Card,
  Text,
  ActionIcon,
  Badge,
  Group,
  useMantineTheme,
  rem,
  Stack,
  Flex,
  Tooltip,
} from "@mantine/core";
import AudioPlayer from "./AudioPlayer";
import { PostWithMedia } from "@/db/schema";
import { UserLike } from "@/types/userTypes";
import { toggleLike } from "@/app/actions/likeActions";
import { useAtomValue } from "jotai";
import { profileAtom } from "./FMAppShell";
import { useGetLikeCount, useGetUserLike } from "@/queries/likes";
import { useQueryClient } from "@tanstack/react-query";
import { useGetCommentCount } from "@/queries/comments";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PostCardProps {
  clickPost: () => void;
  userLike: UserLike | null;
  post: PostWithMedia;
}

const PostCard = ({ clickPost, userLike, post }: PostCardProps) => {
  const theme = useMantineTheme();
  const queryClient = useQueryClient();
  const profileValue = useAtomValue(profileAtom);
  const [tempLike, setTempLike] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const { data } = useGetUserLike(
    post.posts.id,
    profileValue?.id,
    userLike,
    true,
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

  return (
    <Card withBorder radius="md" w={"100%"} shadow="sm">
      {post?.audio?.url && (
        <Card.Section>
          <Flex
            justify={"center"}
            align={"center"}
            style={{
              zIndex: 999,
            }}
          >
            <AudioPlayer url={post.audio?.url} art={post?.images?.url || ""} />
          </Flex>
        </Card.Section>
      )}
      <Stack gap={4}>
        <Group
          gap={"xs"}
          align="center"
          onClick={() => clickPost()}
          style={{
            cursor: "pointer",
          }}
        >
          <Text
            fz="xl"
            fw={600}
            lineClamp={1}
            style={{
              cursor: "pointer",
              ":hover": {
                textDecoration: "underline",
              },
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {post.posts.title}
          </Text>
        </Group>
        <Group gap={0} align="center">
          {post.posts.description && (
            <Text
              fz="sm"
              c="dimmed"
              lineClamp={1}
              w={"100%"}
              onClick={() => clickPost()}
              style={{
                cursor: "pointer",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {post.posts.description}
            </Text>
          )}
          {post.posts.description && (
            <Text
              fz="sm"
              lineClamp={1}
              component="a"
              onClick={() => clickPost()}
              c={theme.colors.blue[6]}
              style={{
                cursor: "pointer",
                ":hover": {
                  textDecoration: "underline",
                },
                minWidth: "fit-content",
              }}
            >
              View full post
            </Text>
          )}
        </Group>
        <Group
          align="space-between"
          justify="space-between"
          gap={"sm"}
          mx={-5}
          pt={5}
          w={"100%"}
        >
          <Group gap={"xs"}>
            <Badge
              variant="gradient"
              gradient={{ from: "cool-blue", to: "wild-pink" }}
              style={{
                minWidth: "fit-content",
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
                            false,
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
            <Group gap={4} align="center">
              <ActionIcon
                color={theme.primaryColor}
                variant="subtle"
                size={"sm"}
                onClick={() => clickPost()}
              >
                <IconMessageCircle2
                  style={{ width: rem(16), height: rem(16) }}
                />
              </ActionIcon>
              <Text fz="xs" c="dimmed">
                {commentCount || 0}{" "}
                {commentCount === 1 ? "comment" : "comments"}
              </Text>
            </Group>
            <Tooltip
              opened={showTooltip}
              label="Direct link copied to clipboard!"
              position="top"
              color={theme.primaryColor}
              withArrow
            >
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://freqmob.com/post/${post.posts.id}`,
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
      </Stack>
    </Card>
  );
};

export default PostCard;
