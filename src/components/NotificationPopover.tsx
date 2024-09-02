import {
  delNotification,
  putNotificationRead,
} from "@/app/actions/notificationActions";
import { notifications } from "@/lib/db/schema";
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
  ThemeIcon,
} from "@mantine/core";
import {
  IconBell,
  IconMessageCircle2,
  IconTrash,
  IconWriting,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NotificationPopoverProps {
  notificationsList?: (typeof notifications.$inferSelect)[];
}

const NotificationPopover = ({
  notificationsList,
}: NotificationPopoverProps) => {
  const [opened, setOpened] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();
  const isUnread = notificationsList?.some((n) => n.isRead === false);

  async function handleNotificationClick(n: typeof notifications.$inferSelect) {
    if (!n.isRead) {
      await putNotificationRead(n?.id);
      n.isRead = true;
    }
    setOpened(false);
    router.push(`/post/${n.postId}`);
  }

  return (
    <Popover
      width={"440px"}
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
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
          <ActionIcon
            ml={4}
            variant={isUnread ? "light" : "subtle"}
            onClick={() => setOpened((o) => !o)}
          >
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
                  key={n?.id}
                  position="top-end"
                  size={12}
                  disabled={n.isRead}
                >
                  <Card withBorder radius="md" w={"100%"} shadow="sm">
                    <Group align="flex-start" justify="flex-start">
                      <ActionIcon
                        size="xl"
                        onClick={() => handleNotificationClick(n)}
                      >
                        {n.boardId ? <IconWriting /> : <IconMessageCircle2 />}
                      </ActionIcon>
                      <Stack gap={0}>
                        <Group align="center" justify="space-between" mt={-6}>
                          <Button
                            variant="transparent"
                            p={0}
                            size="compact-md"
                            onClick={() => handleNotificationClick(n)}
                          >
                            {(n.boardId ? "New Post" : "New Comment") +
                              " - " +
                              formatDate(n.createdAt)}
                          </Button>
                          <ActionIcon
                            variant="subtle"
                            onClick={async () => {
                              await delNotification(n?.id).then(() => {
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
                          maw={"300px"}
                          showLabel="View Details"
                          hideLabel="Hide Details"
                          onExpandedChange={async () => {
                            if (!n.isRead) {
                              await putNotificationRead(n?.id);
                              n.isRead = true;
                            }
                          }}
                        >
                          <Text>{n.content}</Text>
                        </Spoiler>
                      </Stack>
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
