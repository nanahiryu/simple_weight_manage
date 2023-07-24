'use client';

import { Button, Flex, Icon, Input, Text, VStack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { FaGoogle } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { useState } from 'react';

import { loginWithEmail, loginWithGoogle, signupWithEmail } from '@/lib/auth';
import { CardBase } from '@/components/card';

const SignInPage = () => {
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const { register, getValues } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSignUp = async () => {
    const data = getValues();
    await signupWithEmail(data.email, data.password);
  };

  const onSignIn = async () => {
    const data = getValues();
    await loginWithEmail(data.email, data.password);
  };

  return (
    <Flex align="center" justify="center" p="120px">
      <Flex direction="column" w="80%" align="center">
        <CardBase direction="column" w="600px" my="20px">
          <VStack my="40px" spacing="36px">
            <Text fontSize="2xl" fontWeight="bold">
              {isSignIn ? 'Sign In Page' : 'Sign Up Page'}
            </Text>
            <VStack spacing="16px">
              <Text fontSize="lg" fontWeight="semibold">
                email
              </Text>
              <Input w="360px" {...register('email')} bg="white" />
              <Text fontSize="lg" fontWeight="semibold">
                password
              </Text>
              <Input w="360px" {...register('password')} bg="white" />
            </VStack>
            {isSignIn ? (
              <Button colorScheme="teal" onClick={() => void onSignIn()}>
                sign in with email
              </Button>
            ) : (
              <Button colorScheme="teal" onClick={() => void onSignUp()}>
                sign up with email
              </Button>
            )}

            <Flex w="full" px="20px">
              <Text
                fontSize="lg"
                fontWeight="medium"
                mr="auto"
                _hover={{ cursor: 'pointer', color: 'teal' }}
                onClick={() => setIsSignIn((prev) => !prev)}
              >
                {isSignIn ? `>> sign up` : `>> sign in`}
              </Text>
            </Flex>
          </VStack>
        </CardBase>

        <Button onClick={() => void loginWithGoogle()}>
          <Icon as={FaGoogle as IconType} mr="2" />
          <Text>sign in/up with google</Text>
        </Button>
      </Flex>
    </Flex>
  );
};

export default SignInPage;
