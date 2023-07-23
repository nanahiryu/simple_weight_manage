'use client';

import { Button, Flex, Text } from '@chakra-ui/react';

import { login } from '@/lib/auth';

const SignInPage = () => {
  return (
    <main>
      <Flex align="center" justify="center">
        <Text>Sign In Page</Text>
        <Button onClick={() => void login()}>google login</Button>
      </Flex>
    </main>
  );
};

export default SignInPage;
