import { profiles } from "@/db/schema";

const ProfileHeader = ({
  profile,
}: {
  profile: typeof profiles.$inferSelect;
}) => {
  return (
    <div>
      <h1>{profile?.name || "User not found"}</h1>
    </div>
  );
};

export default ProfileHeader;
