import { useToast, UseToastOptions } from '@chakra-ui/react';

export const useSuccessToast = () => {
  const toast = useToast();
  const baseOptions: UseToastOptions = {
    status: 'success',
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
