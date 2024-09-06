"use client";

import { signup } from "@/app/actions/authActions";
import generateFormData from "@/utils/generateFormData";
import {
  Button,
  Flex,
  LoadingOverlay,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { z } from "zod";

interface SignUpProps {
  close: () => void;
}

interface SignUpFormValues {
  username: string;
  email: string;
  password: string;
  password2: string;
}

const schema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must have at least three characters" })
      .max(100, { message: "Username can have at most 100 characters" }),
    email: z.string().email().optional().or(z.literal("")),
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

const SignUp = ({ close }: SignUpProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<SignUpFormValues>({
    initialValues: {
      username: "",
      email: "",
      password: "",
      password2: "",
    },
    validate: zodResolver(schema),
  });

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          form.validate();
          if (form.errors.username || form.errors.password) return form.errors;
          setLoading(true);
          const data = generateFormData(form.values);
          await signup(data).then((res) => {
            setLoading(false);
            if (res?.error) {
              form.validate();
              notifications.show({
                message: "Failed to create account, please try again later",
                icon: <IconX />,
                autoClose: 3000,
              });
            } else {
              close();
              notifications.show({
                message: "Account created successfully!",
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
            <TextInput
              withAsterisk
              label="Username"
              placeholder="Ideally this should be your artist name"
              {...form.getInputProps("username")}
            />
            <TextInput
              label="Email (Optional)"
              placeholder="test@example.com"
              {...form.getInputProps("email")}
            />
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
            <Button type="submit">Sign Up</Button>
          </Stack>
        </Flex>
      </form>
    </>
  );
};

export default SignUp;
