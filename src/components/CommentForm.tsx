"use client";

import { createComment } from "@/app/actions";
import generateFormData from "@/utils/generateFormData";
import { Button, Flex, Group, Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

interface CommentFormProps {
  postId: number;
}

interface CommentFormValues {
  content: string;
  postId: number;
}

const schema = z.object({
  content: z.string().min(1).max(10000),
  postId: z.number().positive(),
});

const CommentForm = ({ postId }: CommentFormProps) => {
  const form = useForm<CommentFormValues>({
    initialValues: {
      content: "",
      postId,
    },
    validate: zodResolver(schema),
  });
  return (
    <Flex direction="column" gap="md">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          form.validate();
          if (form.errors.content || form.errors.postId) return;
          const data = generateFormData(form.values);
          createComment(data);
        }}
      >
        <Textarea
          label="Comment"
          placeholder="Enter your comment here..."
          required
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

export default CommentForm;
