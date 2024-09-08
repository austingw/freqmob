"use client";

import { boards } from "@/lib/db/schema";
import { Button, Card, Group, Text } from "@mantine/core";
import { useRouter } from "next/navigation";

const BoardCard = ({ board }: { board: typeof boards.$inferSelect }) => {
  const router = useRouter();
  return (
    <Card withBorder radius="md" w={"100%"} shadow="sm">
      <Group align="center" justify="space-between">
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
          fm/{board.name}
        </Text>
        <Button onClick={() => router.push(`/fm/${board.name}`)}>
          View Board
        </Button>
      </Group>
    </Card>
  );
};

export default BoardCard;
