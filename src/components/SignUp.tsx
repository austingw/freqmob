"use client";

import { signup } from "@/app/actions";
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
import { z } from "zod";

interface SignUpFormValues {
  username: string;
  password: string;
  password2: string;
}

const schema = z
  .object({
    username: z.string().min(3).max(31),
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

const SignUp = () => {
  const form = useForm<SignUpFormValues>({
    initialValues: {
      username: "",
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
          const data = generateFormData(form.values);
          signup(data).then((res) => {
            if (res?.error) {
              form.validate();
              form.setErrors({ username: res.error });
            }
          });
        }}
      >
        <Flex>
          <Stack>
            <LoadingOverlay visible={false} />
            <TextInput
              withAsterisk
              label="Username"
              placeholder="Ideally this should be your artist name"
              {...form.getInputProps("username")}
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
