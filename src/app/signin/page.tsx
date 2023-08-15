'use client';

import { Button, Flex, Icon, Input, Text, VStack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { FaGoogle } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';

import { loginWithEmail, loginWithGoogle, signupWithEmail } from '@/function/auth';
import { CardBase } from '@/components/card';
import { useErrorToast } from '@/hooks/useErrorToast';
import { userAtom } from '@/globalState/user';

const SignInPage = () => {
  const user = useAtomValue(userAtom);
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const { register, getValues } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const router = useRouter();
  const errorToast = useErrorToast();

  const onSignUp = async (e: FormEvent) => {
    console.log('sign up');
    try {
      e.preventDefault();
      const data = getValues();
      await signupWithEmail(data.email, data.password);
      router.push('/dashboard');
    } catch (e) {
      const error = e as Error;
      errorToast({
        title: 'エラーが発生しました',
        description: error.message,
      });
    }
  };

  const onSignIn = async (e: FormEvent) => {
    try {
      e.preventDefault();
      console.log('sign in');
      const data = getValues();
      await loginWithEmail(data.email, data.password);
      router.push('/dashboard');
    } catch (e) {
      const error = e as Error;
      errorToast({
        title: 'エラーが発生しました',
        description: error.message,
      });
    }
  };

  const onGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (e) {
      const error = e as Error;
      errorToast({
        title: 'エラーが発生しました',
        description: error.message,
      });
    }
  };

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user]);

  return (
    <Flex align="center" justify="center" p="120px">
      <Flex direction="column" w="80%" align="center">
        <CardBase direction="column" w="600px" my="20px">
          <VStack as="form" my="40px" spacing="36px">
            <Text fontSize="2xl" fontWeight="bold">
              {isSignIn ? 'Sign In Page' : 'Sign Up Page'}
            </Text>
            <VStack spacing="16px">
              <Text fontSize="lg" fontWeight="semibold">
                email
              </Text>
              <Input w="360px" variant="outline" {...register('email')} bg="white" />
              <Text fontSize="lg" fontWeight="semibold">
                password
              </Text>
              <Input w="360px" variant="outline" {...register('password')} bg="white" />
            </VStack>
            {isSignIn ? (
              <Button colorScheme="teal" type="submit" onClick={(e) => void onSignIn(e)}>
                sign in with email
              </Button>
            ) : (
              <Button colorScheme="teal" type="submit" onClick={(e) => void onSignUp(e)}>
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

        <Button onClick={() => void onGoogleSignIn()}>
          <Icon as={FaGoogle as IconType} mr="2" />
          <Text>sign in/up with google</Text>
        </Button>
      </Flex>
    </Flex>
  );
};

export default SignInPage;
