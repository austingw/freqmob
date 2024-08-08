"use client";

import { PostWithMedia } from "@/db/schema";
import { UserLike } from "@/types/userTypes";
import Post from "./Post";

interface PostWrapperProps {
  userLike: UserLike | null;
  post: PostWithMedia;
}

const PostWrapper = ({ userLike, post }: PostWrapperProps) => {
  return (
    <div>
      <Post clickClose={() => {}} userLike={userLike} post={post} />
    </div>
  );
};

export default PostWrapper;
