"use client";

import { posts } from "@/db/schema";
import {
  Button,
  Flex,
  Group,
  NumberInput,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import FileUpload from "./FileUpload";
import classes from "./PostForm.module.css";
import { createPost } from "@/app/actions/postActions";
import generateFormData from "@/utils/generateFormData";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import ArtUpload from "./ArtUpload";

interface FormValues {
  title: string;
  description: string;
  file: File | string;
  published: boolean;
  type: string;
  bpm: number;
  key: string;
  inspiration: string;
  genre: string;
  boardName: string;
  uploadUrl: string;
}

const schema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().optional(),
  file: z.instanceof(Blob).optional(),
  published: z.boolean(),
  type: z.enum(posts.type.enumValues),
  bpm: z.number().optional(),
  key: z.string().optional(),
  inspiration: z.string().optional(),
  genre: z.string().optional(),
  boardName: z.string().optional(),
  uploadUrl: z.string().optional(),
});

const PostForm = ({
  close,
  boardList,
}: {
  close: () => void;
  boardList?: string[] | null;
}) => {
  const [showUpload, setShowUpload] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      title: "",
      description: "",
      file: "",
      published: false,
      type: posts.type.enumValues[5],
      bpm: 0,
      key: "",
      inspiration: "",
      genre: "",
      boardName: "",
      uploadUrl: "",
    },
    onValuesChange: (values) => {
      if (values.type !== "text") {
        setShowUpload(true);
      }
      if (values.type === "text") {
        setShowUpload(false);
      }
    },
    validate: zodResolver(schema),
  });

  const addFile = async (file: File) => {
    form.setFieldValue("file", file);
  };

  return (
    <Flex direction="column" gap="xs" w={"75vw"} align="center" pb={10}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          form.validate();
          if (form.errors.title || form.errors.type) return;
          const data = generateFormData(form.values);
          await createPost(data)
            .catch((err) => {
              console.error(err);
              notifications.show({
                message: "Error creating post",
                icon: <IconX />,
                autoClose: 3000,
              });
            })
            .then((res) => {
              if (res?.status === 201) {
                notifications.show({
                  message: "Post created!",
                  icon: <IconCheck />,
                  autoClose: 3000,
                });
                form.reset();
                close();
              } else {
                notifications.show({
                  message: "Failed to create post, please try again",
                  icon: <IconX />,
                  autoClose: 3000,
                });
              }
            });
        }}
      >
        <Stack gap="md">
          <Group align="center" justify="space-between" w={"70vw"}>
            <Select
              label="Board"
              placeholder="Select a board..."
              searchable
              clearable
              data={boardList || undefined}
              onChange={(value) => form.setFieldValue("boardName", value || "")}
            />
            <Stack gap={2}>
              <Text fz={"sm"} fw={500}>
                Type
              </Text>
              <SegmentedControl
                data={posts.type.enumValues}
                color="primary"
                value={form.values.type}
                onChange={(value) => form.setFieldValue("type", value)}
                radius="md"
                size="sm"
                classNames={{
                  indicator: classes.segmentedIndicator,
                }}
              />
            </Stack>
          </Group>{" "}
          <TextInput
            withAsterisk
            label="Title"
            placeholder="Enter a title..."
            {...form.getInputProps("title")}
          />
          <Textarea
            label="Description"
            placeholder="Describe your post..."
            {...form.getInputProps("description")}
            resize="vertical"
          />
          {showUpload && (
            <Group align="center" justify="space-between" gap={"md"}>
              <NumberInput
                label="BPM"
                placeholder="Enter the BPM..."
                {...form.getInputProps("bpm")}
                w={"90px"}
              />
              <TextInput
                label="Key"
                placeholder="Enter the key..."
                {...form.getInputProps("key")}
              />
              <TextInput
                label="Inspiration"
                placeholder="Enter the inspiration..."
                {...form.getInputProps("inspiration")}
              />
              <TextInput
                label="Genre"
                placeholder="Enter the genre..."
                {...form.getInputProps("genre")}
              />
              <ArtUpload />
            </Group>
          )}
          {showUpload && <FileUpload addFile={addFile} />}
        </Stack>
        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
          <Button variant="light" onClick={close}>
            Cancel
          </Button>
        </Group>
      </form>
    </Flex>
  );
};

export default PostForm;
