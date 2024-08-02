import { putNotificationRead } from "@/app/actions/notificationActions";
import { notifications } from "@/db/schema";
import formatDate from "@/utils/formatDate";
import {
  ActionIcon,
  Card,
  Indicator,
  Popover,
  Spoiler,
  Stack,
  Text,
} from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import { useState } from "react";

interface NotificationPopoverProps {
  notifications?: (typeof notifications.$inferSelect)[];
}

const NotificationPopover = ({ notifications }: NotificationPopoverProps) => {
  const isUnread = notifications?.some((n) => n.isRead === false);

  return (
    <Popover width={300} position="bottom" withArrow shadow="md">
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
          <ActionIcon variant="outline">
            <IconBell size={20} />
          </ActionIcon>
        </Indicator>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          {notifications?.map((n) => {
            return (
              <Indicator
                key={n.id}
                position="top-end"
                size={12}
                disabled={n.isRead}
              >
                <Card withBorder radius="md" w={"100%"} shadow="sm">
                  <Text>
                    {n.boardId
                      ? "New Post"
                      : "New Comment" + " - " + formatDate(n.createdAt)}
                  </Text>
                  <Spoiler
                    maxHeight={0}
                    showLabel="View Details"
                    hideLabel="Hide Details"
                    onExpandedChange={async () => {
                      if (!n.isRead) {
                        await putNotificationRead(n.id);
                      }
                    }}
                  >
                    <Text>{n.content}</Text>
                  </Spoiler>
                </Card>
              </Indicator>
            );
          })}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default NotificationPopover;
