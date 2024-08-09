"use client";

import { logout } from "@/app/actions/authActions";
import AuthModal from "@/components/AuthModal";
import { profiles } from "@/db/schema";
import { useGetBoardList } from "@/queries/boards";
import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Button,
  Group,
  Indicator,
  Menu,
  Modal,
  Popover,
  Skeleton,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBell, IconPlus, IconSearch } from "@tabler/icons-react";
import { atom, useAtom } from "jotai";
import { Session, User } from "lucia";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PostForm from "./PostForm";
import CreateBoardInput from "./CreateBoardInput";
import { useQueryClient } from "@tanstack/react-query";
import ProfileUpdateForm from "./ProfileUpdateForm";
import { useGetNotifications } from "@/queries/notifications";
import NotificationPopover from "./NotificationPopover";

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
  const [modalContent, setModalContent] = useState<"login" | "post" | "edit">(
    "login",
  );
  const [modalTitle, setModalTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const theme = useMantineTheme();
  const queryClient = useQueryClient();

  //global state for logged in profile
  const [profileValue, setProfileValue] = useAtom(profileAtom);
  useEffect(() => {
    if (profile) {
      setProfileValue(profile);
    }
  }, [profile, setProfileValue]);

  const { data, isLoading } = useGetBoardList(profileValue?.id);
  const { data: notifications } = useGetNotifications(profileValue?.id, 1);

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
          <Group align="center" justify="flex-end" p={0} gap={8}>
            <ActionIcon
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
              <IconPlus size={20} />
            </ActionIcon>
            {user.user && <NotificationPopover notifications={notifications} />}
            {user.user ? (
              <Menu
                trigger="click-hover"
                position="bottom-end"
                withArrow
                arrowPosition="center"
                openDelay={100}
                closeDelay={500}
              >
                <Menu.Target>
                  <UnstyledButton>
                    <Avatar
                      src={profileValue?.avatar}
                      name={profileValue?.name}
                      size={40}
                      color={theme.primaryColor}
                    />
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>
                    <Button
                      p={0}
                      variant="transparent"
                      onClick={() => {
                        router.push(`/u/${profileValue?.name}`);
                      }}
                    >
                      Profile
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button
                      p={0}
                      variant="transparent"
                      onClick={() => {
                        setModalContent("edit");
                        setModalTitle("Edit Profile Info");
                        open();
                      }}
                    >
                      Edit Info
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button
                      p={0}
                      variant="transparent"
                      onClick={async () =>
                        await logout().then(() => {
                          queryClient.invalidateQueries({
                            queryKey: ["boardList", profileValue?.id],
                          });
                          setProfileValue(profiles.$inferSelect);
                        })
                      }
                    >
                      Logout
                    </Button>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Button
                variant="transparent"
                p={0}
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
            {modalContent === "edit" && <ProfileUpdateForm close={close} />}
            {modalContent === "post" && (
              <PostForm close={close} boardList={data?.data} />
            )}
          </Modal>
        </Group>
      </AppShell.Header>{" "}
      <AppShell.Navbar p="md">
        <Stack align="flex-start" justify="space-between" h={"100%"}>
          <Stack
            align="flex-start"
            justify="flex-start"
            gap={isLoading ? 8 : 0}
            w={"100%"}
          >
            <TextInput
              variant="filled"
              radius={"sm"}
              placeholder="Search for boards/posts"
              w={"100%"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
              leftSection={<IconSearch size={16} />}
              leftSectionProps={{
                onClick: () => {
                  if (searchTerm.length > 0) {
                    router.push(`/search?term=${searchTerm}`);
                  }
                },
                style: { cursor: "pointer" },
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchTerm.length > 0) {
                  router.push(`/search?term=${searchTerm}`);
                }
              }}
              pb={8}
            />
            <Text c="black">
              {profile ? "your boards" : "login to view boards!"}
            </Text>{" "}
            {isLoading && <Skeleton height={20} width={200} />}
            {isLoading && <Skeleton height={20} width={200} />}
            {isLoading && <Skeleton height={20} width={200} />}
            {!isLoading && profileValue && (
              <Button
                variant="transparent"
                p={0}
                onClick={() => router.push(`/fm/main`)}
              >
                home
              </Button>
            )}
            {!isLoading && data?.data && data?.data?.length >= 1 ? (
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
                {!isLoading && profile ? "no boards found, join some!" : ""}
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
