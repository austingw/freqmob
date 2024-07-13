import { profiles } from "@/db/schema";
import { Stack, Text } from "@mantine/core";

interface ProfileDetailsProps {
  profile: typeof profiles.$inferSelect;
  postCount: number;
  commentCount: number;
}

const ProfileDetails = ({
  profile,
  postCount,
  commentCount,
}: ProfileDetailsProps) => {
  return (
    <Stack>
      <Text>Bio: {profile.bio}</Text>
      <Text>Website: {profile.website}</Text>
      <Text>Soundcloud: {profile.soundcloud}</Text>
      <Text>Bandcamp: {profile.bandcamp}</Text>
      <Text>Spotify: {profile.spotify}</Text>
      <Text>User since: {profile.createdAt}</Text>
      <Text># of Posts: {postCount}</Text>
      <Text># of Comments: {commentCount}</Text>
    </Stack>
  );
};

export default ProfileDetails;
