import { IconHeart, IconMessageCircle2 } from "@tabler/icons-react";
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
} from "@mantine/core";
import AudioPlayer from "./AudioPlayer";

interface PostCardProps {
  url: string;
  art: string;
  clickPost: () => void;
  clickLike: () => void;
  clickComment: () => void;
}

const PostCard = ({
  url,
  art,
  clickPost,
  clickLike,
  clickComment,
}: PostCardProps) => {
  const theme = useMantineTheme();

  return (
    <Card
      withBorder
      radius="md"
      w={"100%"}
      shadow="sm"
      style={{
        cursor: "pointer",
      }}
    >
      <Card.Section>
        <Flex
          justify={"center"}
          align={"center"}
          style={{
            zIndex: 999,
          }}
        >
          <AudioPlayer url={url} art={art} />
        </Flex>
      </Card.Section>
      <Stack gap={4}>
        <Group
          gap={"xs"}
          align="center"
          onClick={() => clickPost()}
          style={{
            cursor: "pointer",
          }}
        >
          <Badge
            variant="gradient"
            gradient={{ from: "yellow", to: "red" }}
            style={{
              minWidth: "fit-content",
            }}
          >
            demo
          </Badge>
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
            Two Pillarz Two Pillarz Two Pillarz Two Pillarz Two Pillarz Two
            Pillarz Two Pillarz Two Pillarz Two Pillarz Two Pillarz Two Pillarz
            Two Pillarz Two Pillarz Two Pillarz Two Pillarz Two Pillarz Two
            Pillarz Two Pillarz Two Pillarz Two Pillarz Two Pillarz Two Pillarz
            Two Pillarz Two Pillarz Two Pillarz Two Pillarz Two Pillarz Two
            Pillarz Two Pillarz Two Pillarz Two Pillarz Two Pillarz Two Pillarz
            Two Pillarz Two Pillarz Two Pillarz Two Pillarz Two Pillarz Two
            Pillarz Two Pillarz Two Pillarz Two Pillarz Two Pillarz Two Pillarz
            Two Pillarz Two Pillarz Two Pillarz Two Pillarz
          </Text>
        </Group>
        <Group gap={0} align="center">
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
        </Group>
        <Group align="flex-start" gap={"sm"} mx={-5} pt={5}>
          <Group gap={"xs"} align="center">
            <Group gap={4} align="center">
              <ActionIcon color={"red"} size={"sm"} onClick={() => clickLike()}>
                <IconHeart style={{ width: rem(16), height: rem(16) }} />
              </ActionIcon>
              <Text fz="xs" c="dimmed">
                733 likes
              </Text>
            </Group>
            <Group gap={4} align="center">
              <ActionIcon
                color={"yellow"}
                size={"sm"}
                onClick={() => clickComment()}
              >
                <IconMessageCircle2
                  style={{ width: rem(16), height: rem(16) }}
                />
              </ActionIcon>
              <Text fz="xs" c="dimmed">
                12094 comments
              </Text>
            </Group>
          </Group>

          <Badge
            variant="outline"
            onClick={() => {
              console.log("posted by");
            }}
            style={{
              cursor: "pointer",
              ":hover": {
                backgroundColor: "gray",
              },
            }}
          >
            Bill Wormeater
          </Badge>
        </Group>
      </Stack>
    </Card>
  );
};

export default PostCard;
