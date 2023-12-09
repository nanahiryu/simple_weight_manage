import { Flex, Text } from '@chakra-ui/react';

interface EditRowProps {
  label: string;
  children: React.ReactNode;
}

const EditRow = (props: EditRowProps) => {
  return (
    <Flex w="full" px="16px" py="8px" gap="4px" direction="column">
      <Text minW="max-content" fontSize="md" fontWeight="bold" color="text.lightblack">
        {props.label}
      </Text>
      {props.children}
    </Flex>
  );
};

export default EditRow;
