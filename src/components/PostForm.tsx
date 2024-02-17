"use client";

import { Button, Flex, Group, TextInput, Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

const schema = z.object({
  title: z.string(),
  content: z.string(),
});

const PostForm = () => {
  const form = useForm({
    initialValues: {
      title: "",
      content: "",
    },
    validate: zodResolver(schema),
  });

  return (
    <Flex direction="column" gap="md">
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput
          withAsterisk
          label="Title"
          placeholder="Enter a title..."
          {...form.getInputProps("email")}
        />
        <Textarea
          label="Content"
          placeholder="Post content goes here..."
          {...form.getInputProps("content")}
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
          <Button variant="light">Cancel</Button>
        </Group>
      </form>
    </Flex>
  );
};

export default PostForm;
