"use client";

import { logout } from "@/app/actions";
import AuthModal from "@/components/AuthModal";
import { profiles } from "@/db/schema";
import { useGetBoardList } from "@/queries/boards";
import {
  AppShell,
  Burger,
  Button,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { atom, useAtom } from "jotai";
import { Session, User } from "lucia";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PostForm from "./PostForm";
import CreateBoardInput from "./CreateBoardInput";

export const profileAtom = atom(profiles.$inferSelect);

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
  const [modalContent, setModalContent] = useState<"login" | "post">("login");
  const [modalTitle, setModalTitle] = useState("");

  //global state for logged in profile
  const [profileValue, setProfileValue] = useAtom(profileAtom);
  useEffect(() => {
    if (profile) {
      setProfileValue(profile);
    }
  }, [profile, setProfileValue]);

  const { data, isLoading, refetch } = useGetBoardList(profileValue?.id);

  const router = useRouter();

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
        <Group h="100%" px="md" align="center" justify="space-between">
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
          <Group align="center" justify="flex-end" p={0} gap={0}>
            <Button
              variant="subtle"
              p={4}
              onClick={() => {
                if (user.user) {
                  setModalContent("post");
                  setModalTitle("Create Post");
                  open();
                } else {
                  setModalContent("login");
                  setModalTitle("Login");
                  open();
                }
              }}
            >
              <IconPlus size={16} /> Post
            </Button>
            {user.user ? (
              <Button variant="transparent" onClick={() => logout()}>
                Logout
              </Button>
            ) : (
              <Button
                variant="transparent"
                onClick={() => {
                  setModalContent("login");
                  setModalTitle("Login");
                  open();
                }}
              >
                Login
              </Button>
            )}
          </Group>
          <Modal
            opened={opened}
            onClose={close}
            size={"auto"}
            title={modalTitle}
            style={{
              ".mantine-Modal-title": {
                fontWeight: 6000,
              },
            }}
          >
            {modalContent === "login" && (
              <AuthModal setModalTitle={setModalTitle} close={close} />
            )}
            {modalContent === "post" && <PostForm close={close} />}
          </Modal>
        </Group>
      </AppShell.Header>{" "}
      <AppShell.Navbar p="md">
        <Stack align="flex-start" justify="space-between" h={"100%"}>
          <Stack align="flex-start" justify="flex-start" gap={0}>
            <Text c="black">
              {profileValue ? "your boards" : "login to view boards!"}
            </Text>
            {data?.data && data?.data?.length >= 1 ? (
              data.data.map((board) => (
                <Button
                  variant="transparent"
                  p={0}
                  key={board}
                  onClick={() => router.push(`/fm/${board}`)}
                >
                  fm/{board}
                </Button>
              ))
            ) : (
              <Text c="black">
                {profileValue ? "no boards found, join some!" : ""}
              </Text>
            )}
          </Stack>
          <Stack align="flex-start" justify="flex-start" gap={0}>
            {profileValue && <CreateBoardInput />}
          </Stack>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
