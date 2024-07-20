"use client";

import { Button, Group, Menu, Text } from "@mantine/core";
import { atom, useAtom, useAtomValue } from "jotai";
import { joinBoard, leaveBoard } from "@/app/actions/boardActions";
import { useGetBoardList } from "@/queries/boards";
import { useQueryClient } from "@tanstack/react-query";
import { IconCaretDown, IconCaretUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { profileAtom } from "./FMAppShell";

interface BoardHeaderProps {
  name: string;
}
export const sortAtom = atom("new");

const BoardHeader = ({ name }: BoardHeaderProps) => {
  const queryClient = useQueryClient();
  const profileValue = useAtomValue(profileAtom);
  const [sortValue, setSortValue] = useAtom(sortAtom);
  const { data } = useGetBoardList(profileValue?.id);
  const [opened, setOpened] = useState(false);

  const parseLabel = (sort: string) => {
    switch (sort) {
      case "new":
        return "Latest";
      case "likes":
        return "Top";
      case "comments":
        return "Comments";
      default:
        return "Latest";
    }
  };

  const [menuTitle, setMenuTitle] = useState(parseLabel(sortValue));

  useEffect(() => {
    setMenuTitle(parseLabel(sortValue));
  }, [sortValue]);

  return (
    <Group align="center" justify="space-between" pb={8} pt={0}>
      <Group align="center" justify="flex-start" gap={0}>
        {name?.length > 0 && (
          <Text fz={"h1"} fw={"bold"} pb={8}>
            {name}
          </Text>
        )}
        <Menu
          opened={opened}
          onChange={setOpened}
          trigger="click-hover"
          position="bottom-start"
          withArrow
          arrowPosition="center"
          openDelay={100}
          closeDelay={500}
        >
          <Menu.Target>
            <Button variant="transparent" px={8}>
              {menuTitle}{" "}
              {opened ? <IconCaretUp size={16} /> : <IconCaretDown size={16} />}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item>
              <Button
                p={0}
                variant="transparent"
                onClick={() => setSortValue("new")}
              >
                Latest
              </Button>
            </Menu.Item>
            <Menu.Item>
              <Button
                p={0}
                variant="transparent"
                onClick={() => setSortValue("likes")}
              >
                Top
              </Button>
            </Menu.Item>
            <Menu.Item>
              <Button
                p={0}
                variant="transparent"
                onClick={() => setSortValue("comments")}
              >
                Comments
              </Button>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      {name?.length > 0 &&
        data?.status === 200 &&
        (!data?.data?.includes(name) ? (
          <Button
            onClick={async () =>
              await joinBoard(profileValue.id, name)
                .catch((e) => console.error(e))
                .then(() =>
                  queryClient.invalidateQueries({
                    queryKey: ["boardList", profileValue.id],
                  }),
                )
            }
          >
            Join
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={async () =>
              await leaveBoard(profileValue.id, name)
                .catch((e) => console.error(e))
                .then(() =>
                  queryClient.invalidateQueries({
                    queryKey: ["boardList", profileValue.id],
                  }),
                )
            }
          >
            Leave
          </Button>
        ))}
    </Group>
  );
};

export default BoardHeader;
