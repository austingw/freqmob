"use client";

import { Button, Group } from "@mantine/core";
import { useAtomValue } from "jotai";
import { profileAtom } from "./FMAppShell";
import { joinBoard, leaveBoard } from "@/app/actions/boardActions";
import { useGetBoardList } from "@/queries/boards";
import { useQueryClient } from "@tanstack/react-query";

interface BoardHeaderProps {
  name: string;
}

const BoardHeader = ({ name }: BoardHeaderProps) => {
  const queryClient = useQueryClient();
  const profileValue = useAtomValue(profileAtom);
  const { data } = useGetBoardList(profileValue?.id);

  return (
    <Group align="center" justify="space-between" pb={8} pt={0}>
      <h1>{name}</h1>
      {data?.status === 200 &&
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
