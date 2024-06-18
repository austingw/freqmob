"use client";

import { logout } from "@/app/actions";
import AuthModal from "@/components/AuthModal";
import { profiles } from "@/db/schema";
import { AppShell, Burger, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { atom, useAtom } from "jotai";
import { Session, User } from "lucia";
import { useMemo } from "react";

export default function FMAppShell({
  children,
  profile,
  user,
}: Readonly<{
  children: React.ReactNode;
  user: { user: User; session: Session } | { user: null; session: null };
  profile: typeof profiles.$inferSelect | null;
}>) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [opened, { open, close }] = useDisclosure(false);

  //global state for logged in profile
  const profileAtom = useMemo(() => atom(profile), [profile]);
  const [profileValue] = useAtom(profileAtom);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
      color="black"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
          />
          {user.user ? (
            <Text onClick={() => logout()} c="black">
              Logout
            </Text>
          ) : (
            <Text onClick={open} c="black">
              Login
            </Text>
          )}
          <Modal opened={opened} onClose={close}>
            <AuthModal />
          </Modal>
        </Group>
      </AppShell.Header>{" "}
      <AppShell.Navbar p="md">
        <Text c="black"> Groups</Text>
        {profileValue?.boardList &&
          profileValue.boardList.map((board) => (
            <Text key={board}>{board}</Text>
          ))}
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
