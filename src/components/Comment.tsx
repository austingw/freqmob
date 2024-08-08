import { CommentWithProfile, comments } from "@/db/schema";
import formatDate from "@/utils/formatDate";
import {
  Avatar,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useRouter } from "next/navigation";

const Comment = ({ comment }: { comment: CommentWithProfile }) => {
  const router = useRouter();
  const theme = useMantineTheme();

  <Paper withBorder radius="md" key={comment.comments.id} px={10}>
    <Stack gap={0} p={4} pb={12}>
      <Group gap={4} align="center" justify="flex-start">
        <Avatar
          src={comment?.profiles?.avatar}
          name={comment?.profiles?.name}
          size={"sm"}
          color={theme.primaryColor}
        />
        <Button
          fz="xs"
          variant="transparent"
          p={0}
          onClick={() => {
            router.push(`/u/${comment.profiles.name}`);
          }}
        >
          {comment.profiles.name}
        </Button>
        <Text fz="xs" c="dimmed">
          - {formatDate(comment.comments.createdAt)}
        </Text>
      </Group>
      <Text fz="sm">{comment.comments.content}</Text>
    </Stack>
  </Paper>;
};

export default Comment;
