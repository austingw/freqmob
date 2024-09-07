"use client";

import { PostWithMedia } from "@/lib/db/schema";
import { UserLike } from "@/types/userTypes";
import Post from "./Post";
import { Card, Stack } from "@mantine/core";

interface PostWrapperProps {
  userLike: UserLike | null;
  post: PostWithMedia;
}

const PostWrapper = ({ userLike, post }: PostWrapperProps) => {
  return (
    <Stack h={"100%"}>
      <Card withBorder h={"100%"}>
        <Post clickClose={() => {}} hideClose userLike={userLike} post={post} />
      </Card>
    </Stack>
  );
};

export default PostWrapper;
