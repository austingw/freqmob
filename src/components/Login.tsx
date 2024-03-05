"use client";

import { login } from "@/app/actions";
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
import { useState } from "react";
import { z } from "zod";

interface LoginFormValues {
  username: string;
  password: string;
}

const schema = z.object({
  username: z.string().min(3).max(31),
  password: z.string().min(6).max(100),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm<LoginFormValues>({
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
          form.validate();
          if (form.errors.username || form.errors.password) return form.errors;
          const data = generateFormData(form.values);
          setLoading(true);
          login(data).then((res) => {
            setLoading(false);
            if (res?.error) {
              form.validate();
              form.setErrors({ username: res.error, password: res.error });
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
              placeholder=""
              {...form.getInputProps("username")}
            />
            <PasswordInput
              withAsterisk
              label="Password"
              placeholder=""
              {...form.getInputProps("password")}
            />
            <Button type="submit">Login</Button>
          </Stack>
        </Flex>
      </form>
    </>
  );
};

export default Login;
