import { Button, Stack, Text } from "@mantine/core";
import { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";

interface AuthModelProps {
  close: () => void;
}

const AuthModal = ({ close }: AuthModelProps) => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <Stack align="center">
      <Text c="black"> {isLogin ? "Login" : "Signup"} </Text>
      {isLogin ? <Login close={close} /> : <SignUp close={close} />}

      <Button
        variant="transparent"
        c="black"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Don't have an account? Sign up"
          : "Already have an account? Log in"}
      </Button>
    </Stack>
  );
};

export default AuthModal;
