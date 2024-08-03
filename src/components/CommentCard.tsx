import { CommentWithPost } from "@/db/schema";
import formatDate from "@/utils/formatDate";
import { Card, Group, Stack, Text, useMantineTheme } from "@mantine/core";

interface CommentCardProps {
  clickPost: () => void;
  comment: CommentWithPost;
  name: string;
}

const CommentCard = ({ clickPost, comment, name }: CommentCardProps) => {
  const theme = useMantineTheme();
  return (
    <Card withBorder radius="md" w={"100%"} shadow="sm">
      <Stack gap={0}>
        <Group
          gap={4}
          align="center"
          onClick={() => clickPost()}
          style={{
            cursor: "pointer",
          }}
        >
          <Text fz="md" c="black">
            u/{name} commented on
            <b> {comment?.posts?.title}</b>{" "}
          </Text>
          <Text fz="sm" c="dimmed">
            {" "}
            {formatDate(comment.comments.createdAt)}
          </Text>
        </Group>
        <Group gap={0} align="center">
          {comment.comments.content && (
            <Text
              fz="sm"
              c="dimmed"
              w={"100%"}
              onClick={() => clickPost()}
              style={{
                cursor: "pointer",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {comment.comments.content}
            </Text>
          )}
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
      </Stack>
    </Card>
  );
};

export default CommentCard;
