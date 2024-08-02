import { notifications } from "@/db/schema";
import { ActionIcon, Indicator, Popover, Text } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";

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
        {notifications?.map((n) => {
          return <Text key={n.id}>{n.content}</Text>;
        })}
      </Popover.Dropdown>
    </Popover>
  );
};

export default NotificationPopover;
