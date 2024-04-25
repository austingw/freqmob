"use server";

import Feed from "@/components/Feed";
import { queryPosts } from "@/utils/operations/postDbOperations";

export default async function Page() {
  const posts = await queryPosts(1);
  return (
    <div>
      <Feed initialPosts={posts} />
    </div>
  );
}
