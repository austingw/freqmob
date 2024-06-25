"use client";

import { createComment } from "@/app/actions";
import generateFormData from "@/utils/generateFormData";
import { Button, Flex, Group, Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

interface CommentFormProps {
  postId: number;
  setValue: (value: string | null) => void;
}

interface CommentFormValues {
  content: string;
  postId: number;
}

const schema = z.object({
  content: z.string().min(1).max(10000),
  postId: z.number().positive(),
});

const CommentForm = ({ postId, setValue }: CommentFormProps) => {
  const queryClient = useQueryClient();

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
          await createComment(data)
            .catch((err) => {
              console.error(err);
              notifications.show({
                message: "Error creating comment",
                icon: <IconX />,
                autoClose: 3000,
              });
            })
            .then((res) => {
              if (res?.status === 201) {
                notifications.show({
                  message: "Comment created!",
                  icon: <IconCheck />,
                  autoClose: 3000,
                });

                form.reset();
                queryClient.invalidateQueries({
                  queryKey: ["comments", postId],
                });
              } else {
                notifications.show({
                  message: "Failed to create comment, please try again",
                  icon: <IconX />,
                  autoClose: 3000,
                });
              }
            });
        }}
      >
        <Textarea
          placeholder="Enter your comment here..."
          required
          {...form.getInputProps("content")}
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
          <Button
            variant="light"
            onClick={() => {
              setValue(null);
              form.reset();
            }}
          >
            Cancel
          </Button>
        </Group>
      </form>
    </Flex>
  );
};

export default CommentForm;
