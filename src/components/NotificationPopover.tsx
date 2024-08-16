import {
  delNotification,
  putNotificationRead,
} from "@/app/actions/notificationActions";
import { notifications } from "@/db/schema";
import formatDate from "@/utils/formatDate";
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Indicator,
  Popover,
  Spoiler,
  Stack,
  Text,
} from "@mantine/core";
import { IconBell, IconTrash } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface NotificationPopoverProps {
  notificationsList?: (typeof notifications.$inferSelect)[];
}

const NotificationPopover = ({
  notificationsList,
}: NotificationPopoverProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const isUnread = notificationsList?.some((n) => n.isRead === false);

  return (
    <Popover width={"fit-content"} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Indicator
          position="top-end"
          size={8}
          processing
          inline
          mr={8}
          mt={4}
          disabled={!isUnread}
        >
          <ActionIcon variant="subtle">
            <IconBell size={20} />
          </ActionIcon>
        </Indicator>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          {notificationsList?.length ? (
            notificationsList?.map((n) => {
              return (
                <Indicator
                  key={n.id}
                  position="top-end"
                  size={12}
                  disabled={n.isRead}
                >
                  <Card withBorder radius="md" w={"100%"} shadow="sm">
                    <Group align="center" justify="flex-start">
                      <Group align="center" justify="space-between">
                        <Text fw={600}>
                          {n.boardId
                            ? "New Post"
                            : "New Comment" + " - " + formatDate(n.createdAt)}
                        </Text>
                        <ActionIcon
                          variant="subtle"
                          onClick={async () => {
                            await delNotification(n.id).then(() => {
                              queryClient.invalidateQueries({
                                queryKey: ["notifications", n.profileId, 1],
                              });
                            });
                          }}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                      <Spoiler
                        maxHeight={0}
                        showLabel="View Details"
                        hideLabel="Hide Details"
                        onExpandedChange={async () => {
                          if (!n.isRead) {
                            await putNotificationRead(n.id);
                            n.isRead = true;
                          }
                        }}
                      >
                        <Text>{n.content}</Text>
                        <Button
                          variant="link"
                          onClick={() =>
                            n.postId
                              ? router.push(`/post/${n.postId}`)
                              : router.push(`/fm/${n.boardId}`)
                          }
                        >
                          {n.postId ? "View Post" : "View Board"}
                        </Button>
                      </Spoiler>
                    </Group>
                  </Card>
                </Indicator>
              );
            })
          ) : (
            <Text fz={"sm"}>No new notifications</Text>
          )}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default NotificationPopover;
