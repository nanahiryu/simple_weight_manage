import { Flex, Input, Select, Spacer } from '@chakra-ui/react';
import React from 'react';
import { useAtomValue } from 'jotai';
import { useForm } from 'react-hook-form';

import { updateBodyPart } from '@/function/bodyPart';
import { userAtom } from '@/globalState/user';
import { BodyPart } from '@/types/bodyPart';
import { CardBase } from '@/components/card';
import { BodyPartColorList } from '@/constants/bodyPartColor';

interface BodyPartCardProps {
  bodyPart: BodyPart;
  bodyPartList: BodyPart[];
  refetchBodyPartList: () => Promise<void>;
}

const BodyPartCard = (props: BodyPartCardProps) => {
  const { bodyPart, bodyPartList, refetchBodyPartList } = props;
  const user = useAtomValue(userAtom);

  const { register, setValue } = useForm({
    defaultValues: {
      name: bodyPart.name,
      color: bodyPart.color,
    },
  });

  const onBlurBodyPart = async (newName: string) => {
    if (!user) return;
    // nameの重複バリデーション
    const otherBodyPartList = bodyPartList.filter((_bodyPart) => _bodyPart.id !== bodyPart.id);
    const isDuplicate = otherBodyPartList.some((_bodyPart) => _bodyPart.name === newName);
    if (isDuplicate) {
      alert('同じ名前の部位が既に登録されています。');
      setValue('name', bodyPart.name);
      return;
    }
    await updateBodyPart(user.id, bodyPart);
    await refetchBodyPartList();
  };

  const onChangeColor = async (newColor: string) => {
    if (!user) return;
    const newBodyPart = { ...bodyPart, color: newColor };
    await updateBodyPart(user.id, newBodyPart);
    await refetchBodyPartList();
  };

  return (
    <CardBase gap="20px">
      <Flex>
        <Input {...register('name')} onBlur={(e) => void onBlurBodyPart(e.target.value)} bg="white" />
      </Flex>
      <Spacer />
      <Flex gap="4px">
        <Select bg="white" onChange={(e) => void onChangeColor(e.target.value)}>
          {BodyPartColorList.map((color) => (
            <option key={color.name} value={color.displayName}>
              {color.name}
            </option>
          ))}
        </Select>
        <Flex w="60px" h="40px" borderRadius="md" border="2px" borderColor="gray.200">
          <Flex bg={bodyPart.color} w="full" h="full" borderRadius="md" border="2px" borderColor="white" />
        </Flex>
      </Flex>
    </CardBase>
  );
};

export default BodyPartCard;
