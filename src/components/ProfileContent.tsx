"use client";

import { CommentWithPost, PostWithAudio, profiles } from "@/db/schema";
import { SegmentedControl, Stack, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";

type Segment = "details" | "posts" | "comments";

interface ProfileContentProps {
  profile: typeof profiles.$inferSelect;
  posts: PostWithAudio[] | null;
  comments: CommentWithPost[] | null;
}

const ProfileContent = ({ profile, posts, comments }: ProfileContentProps) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [segment, setSegment] = useState<Segment>("details");
  console.log("ppppp", profile);
  return (
    <Stack>
      <SegmentedControl
        color={theme.primaryColor}
        w={isMobile ? "100%" : "300px"}
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
