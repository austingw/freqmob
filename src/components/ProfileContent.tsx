import { comments, posts, profiles } from "@/db/schema";
import { SegmentedControl, Stack } from "@mantine/core";

interface ProfileContentProps {
  profile: typeof profiles.$inferSelect;
  posts: typeof posts.$inferSelect;
  comments: typeof comments.$inferSelect;
}

const ProfileContent = ({ profile, posts, comments }: ProfileContentProps) => {
  console.log("test", profile, posts, comments);
  return (
    <Stack>
      <SegmentedControl data={["Details", "Posts", "Comments"]} />
      <Stack></Stack>
    </Stack>
  );
};

export default ProfileContent;
