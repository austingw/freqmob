"use client";

import { createBoard } from "@/app/actions/boardActions";
import { ActionIcon, Button, Group, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconDeviceFloppy,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { profileAtom } from "./FMAppShell";

const CreateBoardInput = () => {
  const [editable, setEditable] = useState(false);
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const profileValue = useAtomValue(profileAtom);

  const handleSave = async () => {
    await createBoard(name)
      .catch((err) => {
        console.error(err);
        notifications.show({
          message: "Error creating board",
          icon: <IconX />,
          autoClose: 3000,
        });
      })
      .then((res) => {
        if (res?.status === 201) {
          notifications.show({
            message: "Board created!",
            icon: <IconCheck />,
            autoClose: 3000,
          });
          setEditable(false);
          setName("");
          queryClient.invalidateQueries({
            queryKey: ["boardList", profileValue?.id],
          });
        } else {
          notifications.show({
            message: "Failed to create board, please try a different name",
            icon: <IconX />,
            autoClose: 3000,
          });
        }
      });
  };

  const handleCancel = () => {
    setEditable(false);
    setName("");
  };

  return (
    <>
      {editable ? (
        <Group align="center" justify="flex-start" gap="sm" w={"100%"}>
          <TextInput
            value={name}
            left="fm/"
            onChange={(event) => setName(event.currentTarget.value)}
          />
          <ActionIcon onClick={handleSave}>
            <IconDeviceFloppy />
          </ActionIcon>
          <ActionIcon onClick={handleCancel}>
            <IconX />
          </ActionIcon>
        </Group>
      ) : (
        <Group align="center" justify="flex-start" gap="sm">
          <Button variant="transparent" onClick={() => setEditable(true)} p={0}>
            <IconPlus size={16} /> Create Board
          </Button>
        </Group>
      )}
    </>
  );
};

export default CreateBoardInput;
