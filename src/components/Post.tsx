import {
  ActionIcon,
  Flex,
  Group,
  Text,
  Card,
  Stack,
  Badge,
  ScrollArea,
  Paper,
  Accordion,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconHeart,
  IconMessageCircle2,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import AudioPlayer from "./AudioPlayer";
import { PostWithMedia } from "@/db/schema";
import CommentForm from "./CommentForm";
import { useGetComments } from "@/queries/comments";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(tz);

interface PostProps {
  clickClose: () => void;
  post: PostWithMedia;
}

const Post = ({ clickClose, post }: PostProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data, isLoading } = useGetComments(post.posts.id);

  const theme = useMantineTheme();

  return (
    <>
      <ScrollArea.Autosize scrollbarSize={10}>
        <Card radius="md" w={"100%"} shadow="sm" pt={0}>
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

          {post?.audio?.url && (
            <Card.Section>
              <Flex justify={"center"} align={"center"}>
                <AudioPlayer url={post?.audio?.url || ""} art={""} />
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
                  gradient={{ from: "electric-teal", to: "wild-pink" }}
                  style={{
                    minWidth: "fit-content",
                    position: "relative",
                  }}
                >
                  {post.posts.type}
                </Badge>
                <Group gap={4} align="center">
                  <ActionIcon color={theme.primaryColor} size={"xs"}>
                    <IconHeart />
                  </ActionIcon>
                  <Text fz="xs" c="dimmed">
                    {post?.posts?.likeCount || 0}{" "}
                    {post?.posts?.likeCount === 1 ? "like" : "likes"}
                  </Text>
                </Group>
                <Group gap={4} align="center">
                  <ActionIcon
                    color={theme.primaryColor}
                    size={"xs"}
                    style={{
                      cursor: "default",
                    }}
                  >
                    <IconMessageCircle2 />
                  </ActionIcon>
                  <Text fz="xs" c="dimmed">
                    {post?.posts?.commentCount || 0}{" "}
                    {post?.posts?.commentCount === 1 ? "comment" : "comments"}
                  </Text>
                </Group>
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
                w={isMobile ? "100%" : "fit-content"}
                style={{
                  cursor: "pointer",
                  ":hover": {
                    backgroundColor: "gray",
                  },
                }}
              >
                Posted by <b>{post?.profiles?.name}</b>
              </Badge>
            </Group>

            <Accordion
              chevron={<IconPlus size="1rem" />}
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
                  <CommentForm postId={post.posts.id} />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            {data?.map((comment) => (
              <Paper withBorder radius="md" key={comment.comments.id} px={10}>
                <Stack gap={4} p={4}>
                  <Group gap={4} align="center" justify="flex-start">
                    <Text fz="xs" c="dimmed">
                      {comment.profiles.name} -
                    </Text>
                    <Text fz="xs" c="dimmed">
                      {dayjs(dayjs().utc().format()).to(
                        dayjs(comment.comments.createdAt)
                          .utc()
                          .local()
                          .tz()
                          .format("YYYY-MM-DDTHH:mm:ss") + "Z",
                      )}
                    </Text>
                  </Group>
                  <Text fz="sm">{comment.comments.content}</Text>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Card>
      </ScrollArea.Autosize>
    </>
  );
};

export default Post;
