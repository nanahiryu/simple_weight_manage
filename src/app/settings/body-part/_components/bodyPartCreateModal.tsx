import { Flex, Select } from '@chakra-ui/react';
import React from 'react';
import { useAtomValue } from 'jotai';
import { useForm } from 'react-hook-form';

import { createBodyPart } from '@/function/bodyPart';
import { userAtom } from '@/globalState/user';
import { BodyPart } from '@/types/bodyPart';
import { BodyPartColorList, bodyPartDefaultColor } from '@/constants/bodyPartColor';
import { EditModal, EditModalRow, EditModalRowInput } from '@/components/modal';
import { useErrorToast } from '@/hooks/useErrorToast';

interface BodyPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  bodyPartList: BodyPart[];
  refetchBodyPartList: () => Promise<void>;
}

const BodyPartCreateModal = (props: BodyPartModalProps) => {
  const { isOpen, onClose, bodyPartList, refetchBodyPartList } = props;
  const user = useAtomValue(userAtom);

  const { register, handleSubmit, watch, getValues } = useForm({
    defaultValues: {
      name: '',
      color: bodyPartDefaultColor,
    },
  });

  const errorToast = useErrorToast();

  const onRegisterBodyPart = handleSubmit(async () => {
    if (!user) return;
    try {
      const data = getValues();
      // nameの重複バリデーション
      const isDuplicate = bodyPartList.some((bodyPart) => bodyPart.name === data.name);
      if (isDuplicate) {
        throw new Error('同じ名前の部位が既に登録されています。');
      }
      const _newBodyPart = {
        id: '',
        name: data.name,
        color: data.color,
      } as BodyPart;
      await createBodyPart(user.id, _newBodyPart);
      await refetchBodyPartList();
    } catch (e) {
      const error = e as Error;
      errorToast({
        title: 'エラーが発生しました',
        description: error.message,
      });
    }
  });

  return (
    <EditModal
      title="トレーニング部位の追加"
      isOpen={isOpen}
      onClose={onClose}
      onRegister={() => {
        void onRegisterBodyPart();
        onClose();
      }}
    >
      <EditModalRow label="部位名">
        <Flex w="300px">
          <EditModalRowInput w="full" {...register('name')} />
        </Flex>
      </EditModalRow>
      <EditModalRow label="表示色">
        <Flex w="300px" gap="8px">
          <Select bg="white" {...register('color')}>
            {BodyPartColorList.map((color) => (
              <option key={color.name} value={color.displayName}>
                {color.name}
              </option>
            ))}
          </Select>
          <Flex w="60px" h="40px" borderRadius="md" border="2px" borderColor="gray.200">
            <Flex bg={watch('color')} w="full" h="full" borderRadius="md" border="2px" borderColor="white" />
          </Flex>
        </Flex>
      </EditModalRow>
    </EditModal>
  );
};

export default BodyPartCreateModal;
