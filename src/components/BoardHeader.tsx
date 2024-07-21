"use client";

import { Button, Group, Text } from "@mantine/core";
import { atom, useAtom, useAtomValue } from "jotai";
import { joinBoard, leaveBoard } from "@/app/actions/boardActions";
import { useGetBoardList } from "@/queries/boards";
import { useQueryClient } from "@tanstack/react-query";
import { profileAtom } from "./FMAppShell";
import SortMenu from "./SortMenu";

interface BoardHeaderProps {
  name: string;
}
export const sortAtom = atom("new");

const BoardHeader = ({ name }: BoardHeaderProps) => {
  const queryClient = useQueryClient();
  const profileValue = useAtomValue(profileAtom);
  const [sortValue, setSortValue] = useAtom(sortAtom);
  const { data } = useGetBoardList(profileValue?.id);

  return (
    <Group align="center" justify="space-between" pb={8} pt={0}>
      <Group align="center" justify="flex-start" gap={0}>
        {name?.length > 0 && (
          <Text fz={"h1"} fw={"bold"} pb={8}>
            {name}
          </Text>
        )}
        <SortMenu
          sortValue={sortValue as SortOptions}
          setSortValue={setSortValue}
        />
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
