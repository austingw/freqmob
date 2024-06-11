import { Stack, Text } from "@mantine/core";
import { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";

const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <Stack align="center">
      <Text c="black"> {isLogin ? "Login" : "Signup"} </Text>
      {isLogin ? <Login /> : <SignUp />}

      <Text c="black" onClick={() => setIsLogin(!isLogin)}>
        {isLogin
          ? "Don't have an account? Sign up"
          : "Already have an account? Log in"}
      </Text>
    </Stack>
  );
};

export default AuthModal;
