"use client";

import AuthModal from "@/components/AuthModal";
import { AppShell, Burger, Group, Modal, Skeleton, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [opened, { open, close }] = useDisclosure(false);
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
          <Text onClick={open} c="black">
            Login
          </Text>
          <Modal opened={opened} onClose={close}>
            <AuthModal />
          </Modal>
        </Group>
      </AppShell.Header>{" "}
      <AppShell.Navbar p="md">
        Groups
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt="sm" animate={false} />
          ))}
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
