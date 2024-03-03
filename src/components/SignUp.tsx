import {
  Button,
  Flex,
  LoadingOverlay,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

const SignUp = () => {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          console.log("values", values);
        })}
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
            <TextInput
              withAsterisk
              label="Email"
              placeholder="Following this format: your@email.com"
              {...form.getInputProps("email")}
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
