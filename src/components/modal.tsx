import {
  HStack,
  Input,
  InputProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { ReactNode, forwardRef } from 'react';

import { EditButton, PrimaryButton, SecondaryButton } from './buttons';

interface EditModalProps extends ModalProps {
  title: string;
  onRegister: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}
export const EditModal = (props: EditModalProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { title, onRegister, onDelete, disabled = false, onClose, isOpen, children, ...rest } = props;
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} {...rest}>
      <ModalOverlay />
      <ModalContent minW="600px" p="0" pt="24px" overflow="hidden" rounded="lg">
        <ModalHeader px="16px" py="8px" borderBottom="1px" borderColor="gray.300">
          <HStack spacing="4">
            <Text>{title}</Text>
            {onDelete && <EditButton buttonType="delete" onClick={onDelete} />}
          </HStack>
        </ModalHeader>
        <ModalBody p="0">{children}</ModalBody>
        <ModalFooter gap="4px">
          <SecondaryButton w="140px" onClick={onClose}>
            キャンセル
          </SecondaryButton>
          <PrimaryButton w="140px" onClick={onRegister} isDisabled={disabled}>
            登録
          </PrimaryButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

interface EditModalRowProps {
  label: string;
  children: ReactNode;
}

export const EditModalRow = (props: EditModalRowProps) => {
  return (
    <HStack w="full" px="16px" py="8px" justify="space-between" borderBottom="1px" borderColor="gray.300">
      <Text minW="max-content" fontSize="xs" fontWeight="bold" color="text.lightblack">
        {props.label}
      </Text>
      <Spacer />
      {props.children}
    </HStack>
  );
};

export const EditModalRowInput = forwardRef((props: InputProps, ref) => {
  return (
    <Input w="200px" fontSize="sm" border="1px" borderColor="gray.600" bg="bg.body" rounded="lg" {...props} ref={ref} />
  );
});
EditModalRowInput.displayName = 'EditModalRowInput';
