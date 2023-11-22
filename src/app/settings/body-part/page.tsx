'use client';

import { Flex, Icon, Text, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { MdAdd } from 'react-icons/md';
import { useAtomValue } from 'jotai';

import { PrimaryButton } from '@/components/buttons';
import { fetchBodyPartList } from '@/function/bodyPart';
import { userAtom } from '@/globalState/user';
import { BodyPart } from '@/types/bodyPart';

import BodyPartCreateModal from './_components/bodyPartCreateModal';
import BodyPartCard from './_components/bodyPartCard';

const BodyPartSettingsPage = () => {
  const user = useAtomValue(userAtom);
  const [bodyPartList, setBodyPartList] = useState<BodyPart[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const refetchBodyPartList = async () => {
    if (!user) return;
    const _bodyPartList = await fetchBodyPartList(user.id);
    setBodyPartList(_bodyPartList);
  };

  useEffect(() => {
    void refetchBodyPartList();
  }, [user]);

  return (
    <>
      <Flex direction="column" px="40px" gap="20px" w="full" h="full">
        <Flex justify="space-between">
          <Text fontSize="2xl" fontWeight="semibold">
            トレーニング部位
          </Text>
          <PrimaryButton onClick={onOpen} gap="8px">
            <Icon as={MdAdd as IconType} boxSize="20px" />
            <Text fontSize="sm">追加</Text>
          </PrimaryButton>
        </Flex>
        <Flex direction="column" w="full" h="full" gap="12px">
          {bodyPartList.map((bodyPart) => (
            <BodyPartCard
              key={bodyPart.id}
              bodyPart={bodyPart}
              bodyPartList={bodyPartList}
              refetchBodyPartList={refetchBodyPartList}
            />
          ))}
        </Flex>
      </Flex>
      <BodyPartCreateModal
        isOpen={isOpen}
        onClose={onClose}
        bodyPartList={bodyPartList}
        refetchBodyPartList={refetchBodyPartList}
      />
    </>
  );
};

export default BodyPartSettingsPage;
