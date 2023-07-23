"use client";

import { login } from "@/lib/auth";
import { Button, Flex, Text } from "@chakra-ui/react";

const SignInPage = () => {
  return (
    <main>
      <Flex align="center" justify="center">
        <Text>Sign In Page</Text>
        <Button onClick={login}>google login</Button>
      </Flex>
    </main>
  );
};

export default SignInPage;
