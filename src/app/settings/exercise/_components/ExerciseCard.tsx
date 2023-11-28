'use client';

import { Center, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAtomValue } from 'jotai';

import { CardBase } from '@/components/card';
import { LoadType } from '@/constants/loadType';
import { BodyPart } from '@/types/bodyPart';
import { fetchBodyPartList } from '@/function/bodyPart';
import { userAtom } from '@/globalState/user';

interface ExerciseCardProps {
  title: string;
  imagePath: string;
  loadType: LoadType;
  load: number;
  reps: number;
  sets: number;
  bodyPartsIdList: string[];
  onClick?: () => void;
}

const ExerciseCard = (props: ExerciseCardProps) => {
  const { title, imagePath, loadType, load, reps, sets, bodyPartsIdList, onClick } = props;
  const user = useAtomValue(userAtom);
  const [bodyPartsList, setBodyPartsList] = useState<BodyPart[]>([]);

  const refetchBodyPartList = async () => {
    if (!user) return;
    const _bodyPartList = await fetchBodyPartList(user.id);
    const _includesBodyPartList = _bodyPartList.filter((bodyPart) => bodyPartsIdList.includes(bodyPart.id));
    setBodyPartsList(_includesBodyPartList);
  };

  useEffect(() => {
    void refetchBodyPartList();
  }, [bodyPartsIdList, user]);

  const loadTypeText = (() => {
    switch (loadType) {
      case 'weight':
        return `重量：${load}kg`;
      case 'distance':
        return `距離：${load}km`;
      case 'time':
        return `時間：${load}分`;
    }
  })();

  return (
    <CardBase
      w="280px"
      direction="column"
      p="12px"
      gap="12px"
      onClick={onClick}
      _hover={{
        cursor: 'pointer',
        boxShadow: 'sm',
        transition: 'all 0.5s',
      }}
    >
      <Flex>
        <Text fontSize="lg" fontWeight="semibold">
          {title}
        </Text>
      </Flex>
      <Center>
        <Image src={imagePath} alt="" width="240" height="100" />
      </Center>
      <Flex direction="column" gap="4px">
        <Text fontSize="md" fontWeight="medium">
          {loadTypeText}
        </Text>
        <Text fontSize="md" fontWeight="medium">
          {reps}回×{sets}セット
        </Text>
        <Flex gap="8px">
          {bodyPartsList.map((bodyPart) => (
            <Flex key={bodyPart.id} px="8px" borderRadius="md" bg={bodyPart.color}>
              <Text fontSize="md" fontWeight="normal" color="white">
                {bodyPart.name}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </CardBase>
  );
};

export default ExerciseCard;
