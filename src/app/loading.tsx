import { Skeleton, Stack } from "@mantine/core";

export default function Loading() {
  return (
    <Stack w="100%" h="100%" align="center" gap={16}>
      <Skeleton height={50} width={"100%"} radius="xl" />
      <Skeleton height={150} width={"100%"} radius="xl" />
      <Skeleton height={250} width={"100%"} radius="xl" />
    </Stack>
  );
}
