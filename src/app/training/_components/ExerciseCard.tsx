'use client';

import { Center, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { CardBase } from '@/components/card';
import { bodyPartSeedList } from '@/seed/bodyParts';
import { LoadType } from '@/types/exercise';
import { BodyPart } from '@/types/bodyPart';

interface ExerciseCardProps {
  title: string;
  imagePath: string;
  loadType: LoadType;
  load: number;
  reps: number;
  sets: number;
  bodyPartsIdList: string[];
}

const ExerciseCard = (props: ExerciseCardProps) => {
  const { title, imagePath, loadType, load, reps, sets, bodyPartsIdList } = props;
  const [bodyPartsList, setBodyPartsList] = useState<BodyPart[]>([]);

  useEffect(() => {
    const bodyPartsList = bodyPartsIdList.map(
      (bodyPartId) => bodyPartSeedList.find((bodyPart) => bodyPart.id === bodyPartId) ?? bodyPartSeedList[0],
    );
    setBodyPartsList(bodyPartsList);
  }, []);

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
    <CardBase w="280px" direction="column" p="12px" gap="12px">
      <Flex>
        <Text fontSize="lg" fontWeight="semibold">
          {title}
        </Text>
      </Flex>
      <Center>
        <Image src={imagePath} alt="" width="240" height="100" />
      </Center>
      <Flex direction="column" gap="8px">
        <Text fontSize="md" fontWeight="medium">
          {loadTypeText}
        </Text>
        <Text fontSize="md" fontWeight="medium">
          {reps}回×{sets}セット
        </Text>
        <Flex gap="8px">
          {bodyPartsList.map((bodyPart) => (
            <Flex key={bodyPart.id} px="8px" borderRadius="md" bg="teal.400">
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
