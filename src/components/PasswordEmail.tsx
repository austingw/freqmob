"use client";

import { sendPasswordResetToken } from "@/app/actions/authActions";
import generateFormData from "@/utils/generateFormData";
import {
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { z } from "zod";

interface PasswordEmailProps {
  cancel: () => void;
}

interface PasswordEmailFormValues {
  username: string;
  origin: string;
}

const schema = z.object({
  username: z.string().min(3).max(31),
});

const PasswordEmail = ({ cancel }: PasswordEmailProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<PasswordEmailFormValues>({
    initialValues: {
      username: "",
      origin: window.location.origin,
    },
    validate: zodResolver(schema),
  });

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          form.validate();
          if (form.errors.username) return form.errors;
          const data = generateFormData(form.values);
          setLoading(true);
          sendPasswordResetToken(data).then((res) => {
            setLoading(false);
            if (res.status === 400) {
              form.validate();
              notifications.show({
                message: "No email assocaited with this username",
                icon: <IconX />,
                autoClose: 3000,
              });
            } else if (res.status === 500) {
              notifications.show({
                message: "Issue sending reset email, please try again later.",
                icon: <IconX />,
                autoClose: 3000,
              });
            } else if (res.status === 200) {
              close();
              notifications.show({
                message: "Reset email sent!",
                icon: <IconCheck />,
                autoClose: 3000,
              });
            }
          });
        }}
      >
        <Flex>
          <Stack>
            <Text fz={"h5"}>Reset your password via email:</Text>
            <LoadingOverlay visible={loading} />
            <TextInput
              withAsterisk
              label="Username"
              placeholder=""
              {...form.getInputProps("username")}
            />
            <Group justify="flex-end" w={"100%"}>
              <Button type="submit">Send Email</Button>
              <Button variant="light" onClick={cancel}>
                Cancel
              </Button>
            </Group>
          </Stack>
        </Flex>
      </form>
    </>
  );
};

export default PasswordEmail;
