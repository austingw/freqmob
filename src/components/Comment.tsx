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
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { profileAtom } from "./FMAppShell";
import { IconCheck, IconPencil, IconTrash, IconX } from "@tabler/icons-react";
import { delComment, putCommentContent } from "@/app/actions/commentActions";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

interface CommentFormValues {
  content: string;
}

const schema = z.object({
  content: z.string().min(1).max(10000),
});

const Comment = ({ comment }: { comment: CommentWithProfile }) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const queryClient = useQueryClient();
  const profileValue = useAtomValue(profileAtom);
  const [isEditing, setIsEditing] = useState(false);
  const [tempUpdate, setTempUpdate] = useState(comment.comments.content);

  const form = useForm<CommentFormValues>({
    initialValues: {
      content: tempUpdate,
    },
    validate: zodResolver(schema),
  });

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
          <Group gap={4} align="center" justify="flex-end">
            {profileValue?.id === comment?.comments?.profileId && (
              <ActionIcon
                variant="subtle"
                size={"xs"}
                onClick={() => setIsEditing(true)}
              >
                <IconPencil />
              </ActionIcon>
            )}

            {profileValue?.id === comment?.comments?.profileId && (
              <ActionIcon
                variant="subtle"
                size={"xs"}
                onClick={async () => {
                  await delComment(comment.comments.id).then((res) => {
                    if (res?.status === 200) {
                      notifications.show({
                        message: "Comment deleted!",
                        icon: <IconCheck />,
                        autoClose: 3000,
                      });
                      queryClient.invalidateQueries({
                        queryKey: ["comments", comment.comments.postId],
                      });
                      queryClient.invalidateQueries({
                        queryKey: ["commentCount", comment.comments.postId],
                      });
                    }
                  });
                }}
              >
                <IconTrash />
              </ActionIcon>
            )}
          </Group>
        </Group>

        {isEditing ? (
          <Stack pt={8}>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                form.validate();
                if (form.errors.content || form.errors.commentId) return;
                await putCommentContent(
                  comment.comments.id,
                  form.values.content,
                )
                  .catch((err) => {
                    console.error(err);
                    notifications.show({
                      message: "Error updating comment",
                      icon: <IconX />,
                      autoClose: 3000,
                    });
                  })
                  .then(async (res) => {
                    if (res?.status === 200) {
                      notifications.show({
                        message: "Comment successfully updated!",
                        icon: <IconCheck />,
                        autoClose: 3000,
                      });
                      setTempUpdate(form.values.content);
                      setIsEditing(false);
                    } else {
                      notifications.show({
                        message: "Failed to create comment, please try again",
                        icon: <IconX />,
                        autoClose: 3000,
                      });
                    }
                  });
              }}
            >
              <Textarea
                placeholder="Enter your comment here..."
                required
                {...form.getInputProps("content")}
              />
              <Group justify="flex-end" mt="md">
                <Button type="submit">Submit</Button>
                <Button
                  variant="light"
                  onClick={() => {
                    form.setFieldValue("content", tempUpdate);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </Group>
            </form>
          </Stack>
        ) : (
          <Text fz="sm">{tempUpdate}</Text>
        )}
      </Stack>
    </Paper>
  );
};

export default Comment;
