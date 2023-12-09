import { Button, ButtonProps, Flex, Icon, Text } from '@chakra-ui/react';
import { MdCheck, MdDelete, MdEdit } from 'react-icons/md';
import { forwardRef } from 'react';
import { IconType } from 'react-icons';

// 編集、削除等のボタン
const editTypeObj = {
  edit: {
    icon: MdEdit as IconType,
    color: 'pink.500',
    text: '編集',
  },
  delete: {
    icon: MdDelete as IconType,
    color: 'red.500',
    text: '削除',
  },
  finish: {
    icon: MdCheck as IconType,
    color: 'gray.500',
    text: '完了',
  },
  save: {
    icon: MdCheck as IconType,
    color: 'gray.500',
    text: '保存',
  },
};

interface EditButtonProps extends ButtonProps {
  buttonType: keyof typeof editTypeObj;
}
export const EditButton = forwardRef((props: EditButtonProps, ref) => {
  const { buttonType, ...rest } = props;
  return (
    <Button
      rounded="full"
      bg="ui.white"
      border="1px"
      borderColor={editTypeObj[buttonType].color}
      color={editTypeObj[buttonType].color}
      w="60px"
      h="28px"
      {...rest}
      ref={ref}
    >
      <Flex gap="1" alignItems="center">
        <Icon as={editTypeObj[buttonType].icon} />
        <Text fontSize="xs">{editTypeObj[buttonType].text}</Text>
      </Flex>
    </Button>
  );
});

EditButton.displayName = 'EditButton';

export const PrimaryButton = forwardRef((props: ButtonProps, ref) => {
  return (
    <Button
      w="fit-content"
      h="36px"
      px="16px"
      py="12px"
      colorScheme="teal"
      fontSize="sm"
      fontWeight="bold"
      {...props}
      ref={ref}
    />
  );
});
PrimaryButton.displayName = 'PrimaryButton';

export const SecondaryButton = forwardRef((props: ButtonProps, ref) => {
  return (
    <Button
      w="fit-content"
      h="36px"
      px="16px"
      py="12px"
      color="gray.400"
      fontSize="sm"
      fontWeight="bold"
      border="1px"
      borderColor="gray.400"
      bg="none"
      _hover={{
        bg: 'blackAlpha.50',
      }}
      {...props}
      ref={ref}
    />
  );
});
SecondaryButton.displayName = 'SecondaryButton';
