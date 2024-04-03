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
  post: PostWithMedia
}

const Post = ({ post }: PostProps) => {
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
              console.log("click");
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

          <Card.Section>
            <Flex justify={"center"} align={"center"}>
              <AudioPlayer url={post?.audio?.url || ""} art={""} />
            </Flex>
          </Card.Section>
          <Stack gap={4}>
            <Flex
              direction={isMobile ? "column" : "row"}
              align={isMobile ? "flex-start" : "center"}
              justify={isMobile ? "center" : "space-between"}
              gap={isMobile ? 10 : 0}
              pb={isMobile ? 10 : 0}
            >
              <Text fz="xl" fw={600}>
                {post?.posts.title}
              </Text>
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
                Posted by <b>Bill Wormeater</b>
              </Badge>
            </Flex>

            <Text fz="sm" c="dimmed" w={"100%"}>
              A description of the inspo behind the track blah blah blah A
              description of the inspo behind the track blah blah blah A
              description of the inspo behind the track blah blah blah A
              description of the inspo behind the track blah blah blah A
              description of the inspo behind the track blah blah blah A
              description of the inspo behind the track blah blah blah A
              description of the inspo behind the track blah blah blah A
              description of the inspo behind the track blah blah blah A
              description of the inspo behind the track blah blah blah A
              description of the inspo behind the track blah blah blah A
              description of the inspo behind the track blah blah blah A
              description of the inspo behind the track blah blah blah A
              description of the inspo behind the track blah blah blah A
              description of the inspo behind the track blah blah blah A
              description of the inspo behind the track blah blah blah A
              description of the inspo behind the track blah blah blah A
              description of the inspo behind the track blah blah blah A
              description of the inspo behind the track blah blah blah A
              description of the inspo behind the track blah blah blah A
              description of the inspo behind the track blah blah blah A
              description of the inspo behind the track blah blah blah
            </Text>
            <Group align="flex-start" gap={"xs"} py={10}>
              <Badge
                variant="gradient"
                gradient={{ from: "yellow", to: "red" }}
                style={{
                  minWidth: "fit-content",
                  position: "relative",
                }}
              >
                demo
              </Badge>
              <Group gap={4} align="center">
                <ActionIcon color={"red"} size={"xs"}>
                  <IconHeart />
                </ActionIcon>
                <Text fz="xs" c="dimmed">
                  733 likes
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
                  12094 comments
                </Text>
              </Group>
              <Group gap={"xs"} align="center">
                <Text fz="xs" c="dimmed">
                  Genre: <b>House</b>
                </Text>
                <Text fz="xs" c="dimmed">
                  BPM: <b>120</b>
                </Text>
                <Text fz="xs" c="dimmed">
                  Key: <b>A minor</b>
                </Text>
                <Text fz="xs" c="dimmed">
                  Influences: <b>Daft Punk</b>
                </Text>
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
