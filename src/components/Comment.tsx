import { CommentWithProfile } from "@/db/schema";
import formatDate from "@/utils/formatDate";
import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { profileAtom } from "./FMAppShell";
import { IconTrash } from "@tabler/icons-react";
import { delComment } from "@/app/actions/commentActions";
import { useQueryClient } from "@tanstack/react-query";

const Comment = ({ comment }: { comment: CommentWithProfile }) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const queryClient = useQueryClient();

  const profileValue = useAtomValue(profileAtom);

  return (
    <Paper withBorder radius="md" key={comment.comments.id} px={10}>
      <Stack gap={0} p={4} pb={12}>
        <Group align="center" justify="space-between">
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
          {profileValue?.id === comment?.comments?.profileId && (
            <ActionIcon
              variant="subtle"
              size={"xs"}
              onClick={async () => {
                await delComment(comment.comments.id).then(() => {
                  queryClient.invalidateQueries({
                    queryKey: ["comments", comment.comments.postId],
                  });
                  queryClient.invalidateQueries({
                    queryKey: ["commentCount", comment.comments.postId],
                  });
                });
              }}
            >
              <IconTrash />
            </ActionIcon>
          )}
        </Group>
        <Text fz="sm">{comment.comments.content}</Text>
      </Stack>
    </Paper>
  );
};

export default Comment;
