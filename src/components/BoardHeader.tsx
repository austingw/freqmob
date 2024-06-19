"use client";

import { Button, Group } from "@mantine/core";
import { useAtomValue } from "jotai";
import { profileAtom } from "./FMAppShell";
import { joinBoard, leaveBoard } from "@/app/actions";
import { useGetBoardList } from "@/queries/boards";

interface BoardHeaderProps {
  name: string;
}

const BoardHeader = ({ name }: BoardHeaderProps) => {
  const profileValue = useAtomValue(profileAtom);
  const { data, isLoading, refetch } = useGetBoardList(profileValue?.id);

  return (
    <Group>
      <h1>{name}</h1>
      {data?.data &&
        !isLoading &&
        (!data.data.includes(name) ? (
          <Button
            onClick={async () =>
              await joinBoard(name, profileValue.id)
                .catch((e) => console.error(e))
                .then(() => refetch())
            }
            color="red"
          >
            Join
          </Button>
        ) : (
          <Button
            onClick={async () =>
              await leaveBoard(name, profileValue.id)
                .catch((e) => console.error(e))
                .then(() => refetch())
            }
          >
            Leave
          </Button>
        ))}
    </Group>
  );
};

export default BoardHeader;
