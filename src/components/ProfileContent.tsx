"use client";

import { comments, posts, profiles } from "@/db/schema";
import { SegmentedControl, Stack } from "@mantine/core";
import { useState } from "react";

type Segment = "details" | "posts" | "comments";

interface ProfileContentProps {
  profile: typeof profiles.$inferSelect;
  posts: (typeof posts.$inferSelect)[];
  comments: (typeof comments.$inferSelect)[];
}

const ProfileContent = ({ profile, posts, comments }: ProfileContentProps) => {
  const [segment, setSegment] = useState<Segment>("details");
  console.log("ppppp", profile);
  return (
    <Stack>
      <SegmentedControl
        data={["details", "posts", "comments"]}
        value={segment}
        onChange={(value) => setSegment(value as Segment)}
      />
      {segment === "details" && <Stack>{String(profile)}</Stack>}
      {segment === "posts" && <Stack>{String(posts)}</Stack>}
      {segment === "comments" && <Stack>{String(comments)}</Stack>}
    </Stack>
  );
};

export default ProfileContent;
