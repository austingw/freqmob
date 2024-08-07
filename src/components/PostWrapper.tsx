"use client";

import { PostWithMedia } from "@/db/schema";
import { UserLike } from "@/types/userTypes";
import Post from "./Post";
import { Card, Stack } from "@mantine/core";

interface PostWrapperProps {
  userLike: UserLike | null;
  post: PostWithMedia;
}

const PostWrapper = ({ userLike, post }: PostWrapperProps) => {
  return (
    <Stack>
      <Card withBorder>
        <Post clickClose={() => {}} hideClose userLike={userLike} post={post} />
      </Card>
    </Stack>
  );
};

export default PostWrapper;
