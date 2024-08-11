import { Button, Stack } from "@mantine/core";
import { Dispatch, SetStateAction, useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";

interface AuthModelProps {
  close: () => void;
  setModalTitle: Dispatch<SetStateAction<string>>;
}

const AuthModal = ({ close, setModalTitle }: AuthModelProps) => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <Stack align="center">
      {isLogin ? <Login close={close} /> : <SignUp close={close} />}
      <Button
        variant="transparent"
        c="black"
        onClick={() => {
          isLogin ? setModalTitle("Sign Up") : setModalTitle("Login");
          setIsLogin(!isLogin);
        }}
      >
        {isLogin
          ? "Don't have an account? Sign up"
          : "Already have an account? Log in"}
      </Button>
    </Stack>
  );
};

export default AuthModal;
