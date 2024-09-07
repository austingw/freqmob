"use client";

import { postNewPassword } from "@/app/actions/authActions";
import generateFormData from "@/utils/generateFormData";
import {
  Button,
  Flex,
  LoadingOverlay,
  PasswordInput,
  Stack,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

interface PasswordResetFormProps {
  token: string;
  close: () => void;
}

interface PasswordResetFormValues {
  password: string;
  password2: string;
}

const schema = z
  .object({
    password: z
      .string()
      .min(6)
      .max(100)
      .refine((value) => {
        return (
          value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/)
        );
      }, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
    password2: z
      .string()
      .min(6)
      .max(100)
      .refine((value) => {
        return (
          value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/)
        );
      }, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  })
  .refine((values) => {
    return values.password === values.password2;
  }, "Passwords must match");

const PasswordResetForm = ({ token }: PasswordResetFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<PasswordResetFormValues>({
    initialValues: {
      password: "",
      password2: "",
    },
    validate: zodResolver(schema),
  });

  const router = useRouter();

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          form.validate();
          if (form.errors.password || form.errors.password2) return form.errors;
          setLoading(true);
          const data = generateFormData(form.values);
          await postNewPassword(token, data).then((res) => {
            setLoading(false);
            if (res?.status !== 200) {
              form.validate();
              notifications.show({
                message: "Failed to reset password, please try again later",
                icon: <IconX />,
                autoClose: 3000,
              });
            } else {
              router.push("/");
              notifications.show({
                message: "Password changed successfully!",
                icon: <IconCheck />,
                autoClose: 3000,
              });
            }
          });
        }}
      >
        <Flex>
          <Stack>
            <LoadingOverlay visible={loading} />
            <PasswordInput
              withAsterisk
              label="Password"
              placeholder="Password (1 uppercase, 1 lowercase, 1 number)"
              {...form.getInputProps("password")}
            />
            <PasswordInput
              withAsterisk
              label="Confirm Password"
              placeholder="Password (Match what you entered above)"
              {...form.getInputProps("password2")}
            />
            <Button type="submit">Save</Button>
          </Stack>
        </Flex>
      </form>
    </>
  );
};

export default PasswordResetForm;
