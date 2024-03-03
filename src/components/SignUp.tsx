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
}

const schema = z.object({
  username: z.string().min(3).max(100),
  password: z
    .string()
    .min(8)
    .max(100)
    .refine((value) => {
      return (
        value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/)
      );
    }, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
});

const SignUp = () => {
  const form = useForm<SignUpFormValues>({
    initialValues: {
      username: "",
      password: "",
    },
    validate: zodResolver(schema),
  });

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const data = generateFormData(form.values);
          console.log(form.values, data.get("username"), data.get("password"));
          signup(data);
        }}
      >
        <Flex>
          <Stack>
            <LoadingOverlay visible={false} />
            <TextInput
              withAsterisk
              label="Artist Name"
              placeholder="Something cool like Scaremony..."
              {...form.getInputProps("username")}
            />
            <PasswordInput
              withAsterisk
              label="Password"
              placeholder="Password"
              {...form.getInputProps("password")}
            />
            <Button type="submit">Sign Up</Button>
          </Stack>
        </Flex>
      </form>
    </>
  );
};

export default SignUp;
