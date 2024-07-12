"use client";

import { profiles } from "@/db/schema";
import { useAtomValue } from "jotai";
import { profileAtom } from "./FMAppShell";
import { Button, Group } from "@mantine/core";

const ProfileHeader = ({
  profile,
}: {
  profile: typeof profiles.$inferSelect;
}) => {
  const profileValue = useAtomValue(profileAtom);
  return (
    <Group align="center" justify="space-between">
      <h1>{profile?.name || "User not found"}</h1>
      {profileValue?.id === profile?.id && <Button>Edit</Button>}
    </Group>
  );
};

export default ProfileHeader;
