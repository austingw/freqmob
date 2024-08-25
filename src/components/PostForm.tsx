"use client";

import { posts } from "@/lib/db/schema";
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
import ImageUpload from "./ImageUpload";
import { postPostNotification } from "@/app/actions/notificationActions";
import { useMediaQuery } from "@mantine/hooks";

interface FormValues {
  title: string;
  description: string;
  audioFile: File | string;
  imageFile: File | string;
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
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
  description: z.string().optional(),
  audioFile: z.instanceof(Blob).optional(),
  imageFile: z.instanceof(Blob).optional(),
  published: z.boolean(),
  type: z.enum(posts.type.enumValues),
  bpm: z.number().optional(),
  key: z.string().optional(),
  inspiration: z.string().optional(),
  genre: z.string().optional(),
  boardName: z.string().min(1, {
    message: "Please select a board",
  }),
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
  const isMobile = useMediaQuery("(max-width: 768px)");

  const form = useForm<FormValues>({
    initialValues: {
      title: "",
      description: "",
      audioFile: "",
      imageFile: "",
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

  const addFile = async (type: "audioFile" | "imageFile", file: File) => {
    form.setFieldValue(type, file);
  };

  console.log(form.errors);
  return (
    <Flex direction="column" gap="xs" w={"100%"} align="center" pb={10}>
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
            .then(async (res) => {
              if (res?.status === 201) {
                notifications.show({
                  message: "Post created!",
                  icon: <IconCheck />,
                  autoClose: 3000,
                });
                res.data &&
                  (await postPostNotification({
                    boardId: res.data.boardId,
                    postId: res.data.postId,
                    posterId: res.data.profileId,
                    postTitle: res.data.title,
                  }));
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
              error={form.errors.boardName}
              withAsterisk
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
                size={isMobile ? "xs" : "sm"}
                classNames={{
                  indicator: classes.segmentedIndicator,
                }}
              />
            </Stack>
          </Group>
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
            <Flex
              direction={isMobile ? "column" : "row"}
              align={isMobile ? "flex-start" : "center"}
              justify="space-between"
              gap={"md"}
              w={"100%"}
              wrap="nowrap"
            >
              <NumberInput
                label="BPM"
                placeholder="Enter the BPM..."
                {...form.getInputProps("bpm")}
                w={isMobile ? "100%" : "calc(50% - 0.5rem)"}
              />
              <TextInput
                label="Key"
                placeholder="What key..."
                {...form.getInputProps("key")}
                w={isMobile ? "100%" : "calc(50% - 0.5rem)"}
              />
              <TextInput
                label="Inspiration"
                placeholder="What inspired you..."
                {...form.getInputProps("inspiration")}
                w={isMobile ? "100%" : "calc(50% - 0.5rem)"}
              />
              <TextInput
                label="Genre"
                placeholder="What genre..."
                {...form.getInputProps("genre")}
                w={isMobile ? "100%" : "calc(50% - 0.5rem)"}
              />
              <ImageUpload addFile={addFile} title={"Track Art"} />
            </Flex>
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
