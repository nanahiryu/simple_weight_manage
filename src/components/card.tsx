import { Flex, FlexProps } from '@chakra-ui/react';

interface CardProps extends FlexProps {
  children: React.ReactNode;
}

export const CardBase = (props: CardProps) => {
  const { children, ...rest } = props;
  return (
    <Flex bg="gray.100" borderRadius="md" p="12px" boxShadow="md" {...rest}>
      {children}
    </Flex>
  );
};
