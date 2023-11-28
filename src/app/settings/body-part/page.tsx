'use client';

import { Flex, Icon, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { MdAdd } from 'react-icons/md';
import { useAtomValue } from 'jotai';

import { PrimaryButton } from '@/components/buttons';
import { fetchBodyPartList, insertSeedBodyPart } from '@/function/bodyPart';
import { userAtom } from '@/globalState/user';
import { BodyPart } from '@/types/bodyPart';

import BodyPartCard from './_components/bodyPartCard';
import BodyPartCreateModal from './_components/bodyPartCreateModal';

const BodyPartSettingsPage = () => {
  const user = useAtomValue(userAtom);
  const [bodyPartList, setBodyPartList] = useState<BodyPart[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isEmulating = process.env.NEXT_PUBLIC_ENV === 'local';

  const refetchBodyPartList = async () => {
    if (!user) return;
    const _bodyPartList = await fetchBodyPartList(user.id);
    setBodyPartList(_bodyPartList);
  };

  const onClickAddSeedBodyPart = async () => {
    if (!user) return;
    await insertSeedBodyPart(user.id);
    await refetchBodyPartList();
  };

  useEffect(() => {
    void refetchBodyPartList();
  }, [user]);

  return (
    <>
      <Flex direction="column" px="40px" gap="20px" w="full" h="full">
        <Flex>
          <Text fontSize="2xl" fontWeight="semibold">
            トレーニング部位
          </Text>
          <Spacer />
          <Flex gap="8px">
            {isEmulating && (
              <PrimaryButton onClick={() => void onClickAddSeedBodyPart()} gap="8px">
                <Icon as={MdAdd as IconType} boxSize="20px" />
                <Text fontSize="sm">シード追加</Text>
              </PrimaryButton>
            )}
            <PrimaryButton onClick={onOpen} gap="8px">
              <Icon as={MdAdd as IconType} boxSize="20px" />
              <Text fontSize="sm">追加</Text>
            </PrimaryButton>
          </Flex>
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
