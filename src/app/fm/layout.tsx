import FMAppShell from "@/components/FMAppShell";

import { validateRequest } from "@/db/auth";
export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await validateRequest();

  return <FMAppShell user={user}>{children}</FMAppShell>;
}
