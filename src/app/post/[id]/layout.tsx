import FMAppShell from "@/components/FMAppShell";

import { validateRequest } from "@/db/auth";
import { getProfileFromUserId } from "@/utils/operations/userDbOperations";
export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await validateRequest();
  const profile = user.user && (await getProfileFromUserId(user.user.id))?.[0];

  return (
    <FMAppShell user={user} profile={profile}>
      {children}
    </FMAppShell>
  );
}
