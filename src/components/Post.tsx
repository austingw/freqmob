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
  TypographyStylesProvider,
  Accordion,
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

interface PostProps {
  clickClose: () => void;
  post: PostWithMedia
}

const Post = ({ clickClose, post }: PostProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

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

          {post?.audio?.url && <Card.Section>
            <Flex justify={"center"} align={"center"}>
              <AudioPlayer url={post?.audio?.url || ""} art={""} />
            </Flex>
          </Card.Section>}
          <Stack gap={4}>
            <Flex
              direction={isMobile ? "column" : "row"}
              align={isMobile ? "flex-start" : "center"}
              justify={isMobile ? "center" : "space-between"}
              gap={isMobile ? 10 : 0}
              pb={isMobile ? 10 : 0}
            >
              <Text fz="xl" fw={600}>
                {post?.posts?.title}
              </Text>
              <Badge
                variant="outline"
                w={isMobile ? "100%" : "fit-content"}
                style={{
                  cursor: "pointer",
                  ":hover": {
                    backgroundColor: "gray",
                  }
                }}
              >
                Posted by <b>{post?.profiles?.name}</b>
              </Badge>
            </Flex>

            {post.posts.description && <Text fz="sm" c="dimmed" w={"100%"}>
              {post.posts.description}
            </Text>}
            <Group align="flex-start" gap={"xs"} py={10}>
              <Badge
                variant="gradient"
                gradient={{ from: "yellow", to: "red" }}
                style={{
                  minWidth: "fit-content",
                  position: "relative",
                }}
              >
                {post.posts.type}
              </Badge>
              <Group gap={4} align="center">
                <ActionIcon color={"red"} size={"xs"}>
                  <IconHeart />
                </ActionIcon>
                <Text fz="xs" c="dimmed">
                  {post?.posts?.likeCount || 0} {post?.posts?.likeCount === 1 ? "like" : "likes"}
                </Text>
              </Group>
              <Group gap={4} align="center">
                <ActionIcon
                  color={"yellow"}
                  size={"xs"}
                  style={{
                    cursor: "default",
                  }}
                >
                  <IconMessageCircle2 />
                </ActionIcon>
                <Text fz="xs" c="dimmed">
                  {post?.posts?.commentCount || 0} {post?.posts?.commentCount === 1 ? "comment" : "comments"}
                </Text>
              </Group>
              <Group gap={"xs"} align="center">
                {post.posts.genre && <Text fz="xs" c="dimmed">
                  Genre: <b>{post.posts.genre}</b>
                </Text>}
                {post.posts.bpm && <Text fz="xs" c="dimmed">
                  BPM: <b>{post.posts.bpm}</b>
                </Text>}
                {post.posts.key && <Text fz="xs" c="dimmed">
                  Key: <b>{post.posts.key}</b>
                </Text>}
                {post.posts.inspiration && <Text fz="xs" c="dimmed">
                  Influences: <b>{post.posts.inspiration}</b>
                </Text>}
              </Group>
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
                <Accordion.Panel></Accordion.Panel>
              </Accordion.Item>
            </Accordion>

            <Paper radius="md">
              <Group>
                <div>
                  <Text fz="sm">Jacob Warnhalter</Text>
                  <Text fz="xs" c="dimmed">
                    10 minutes ago
                  </Text>
                </div>
              </Group>
              <TypographyStylesProvider>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      '<p>I use <a href="https://heroku.com/" rel="noopener noreferrer" target="_blank">Heroku</a> to host my Node.js application, but MongoDB add-on appears to be too <strong>expensive</strong>. I consider switching to <a href="https://www.digitalocean.com/" rel="noopener noreferrer" target="_blank">Digital Ocean</a> VPS to save some cash.</p>',
                  }}
                />
              </TypographyStylesProvider>
            </Paper>
          </Stack>
        </Card>
      </ScrollArea.Autosize>
    </>
  );
};

export default Post;
