"use client";

import { posts } from "@/db/schema";
import {
  Button,
  Flex,
  Group,
  SegmentedControl,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import FileUpload from "./FileUpload";
import classes from "./PostForm.module.css";
import { createPost } from "@/app/actions";
import generateFormData from "@/utils/generateFormData";

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
  uploadUrl: z.string().optional(),
});

const PostForm = () => {
  const form = useForm<FormValues>({
    initialValues: {
      title: "test",
      description: "",
      file: "",
      published: false,
      type: posts.type.enumValues[1],
      bpm: 0,
      key: "",
      inspiration: "",
      genre: "",
      uploadUrl: "",
    },
    validate: zodResolver(schema),
  });

  const addFile = async (file: File) => {
    form.setFieldValue("file", file);
  };

  return (
    <Flex direction="column" gap="md">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          form.validate();
          if (form.errors.title || form.errors.type) return;
          const data = generateFormData(form.values);
          createPost(data);
        }}
      >
        <Group align="center" justify="center">
          <TextInput
            withAsterisk
            label="Title"
            placeholder="Enter a title..."
            {...form.getInputProps("title")}
          />
          <SegmentedControl
            data={posts.type.enumValues}
            color="primary"
            onChange={(value) => form.setFieldValue("type", value)}
            radius="md"
            size="md"
            classNames={{
              indicator: classes.segmentedIndicator,
            }}
          />
        </Group>
        <Textarea
          label="Content"
          placeholder="Post content goes here..."
          {...form.getInputProps("description")}
        />
        <Group>
          <TextInput
            label="BPM"
            placeholder="Enter the BPM..."
            {...form.getInputProps("bpm")}
          />
          <TextInput
            label="Key"
            placeholder="Enter the key..."
            {...form.getInputProps("key")}
          />
        </Group>
        <Group>
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
        </Group>
        <FileUpload addFile={addFile} />
        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
          <Button variant="light">Cancel</Button>
        </Group>
      </form>
    </Flex>
  );
};

export default PostForm;
