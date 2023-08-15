import { useToast, UseToastOptions } from '@chakra-ui/react';

export const useErrorToast = () => {
  const toast = useToast();
  const baseOptions: UseToastOptions = {
    status: 'error',
    duration: 5000,
    position: 'top',
    isClosable: true,
  };
  const open = (option: { title: string; description: string }) => {
    toast({
      ...baseOptions,
      ...option,
    });
  };
  return open;
};
