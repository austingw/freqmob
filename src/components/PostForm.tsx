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

const schema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().optional(),
  published: z.boolean(),
  type: z.enum(posts.type.enumValues),
  bpm: z.number().optional(),
  key: z.string().optional(),
  inspiration: z.string().optional(),
  genre: z.string().optional(),
});

const PostForm = () => {
  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      published: false,
      type: "text",
      bpm: 0,
      key: "",
      inspiration: "",
      genre: "",
    },
    validate: zodResolver(schema),
  });

  return (
    <Flex direction="column" gap="md">
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Group>
          <TextInput
            withAsterisk
            label="Title"
            placeholder="Enter a title..."
            {...form.getInputProps("title")}
          />
          <SegmentedControl data={posts.type.enumValues} value="text" />
        </Group>
        <Textarea
          label="Content"
          placeholder="Post content goes here..."
          {...form.getInputProps("content")}
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
        <FileUpload />
        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
          <Button variant="light">Cancel</Button>
        </Group>
      </form>
    </Flex>
  );
};

export default PostForm;
