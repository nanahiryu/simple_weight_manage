'use client';

import { Flex, Icon, Spacer, Text, VStack, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { MdAdd } from 'react-icons/md';
import { IconType } from 'react-icons';

import { userAtom } from '@/globalState/user';
import { TrainingTemplate } from '@/types/trainingTemplate';
import { PrimaryButton } from '@/components/buttons';
import { fetchTrainingTemplateList, insertSeedTrainingTemplate } from '@/function/trainingTemplate';
import TrainingTemplateCard from '@/components/trainingTemplateCard';

import TrainingTemplateCrudModal from './_components/trainingTemplateCrudModal';

export interface YearMonth {
  year: number;
  month: number;
}

const TrainingTemplateSettingsPage = () => {
  const user = useAtomValue(userAtom);

  const [trainingTemplateList, setTrainingTemplateList] = useState<TrainingTemplate[]>([]);
  const [type, setType] = useState<'create' | 'edit'>('create');
  const [prevTrainingTemplate, setPrevTrainingTemplate] = useState<TrainingTemplate | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const isEmulating = process.env.NEXT_PUBLIC_ENV === 'local';

  const refetchTrainingTemplateList = async () => {
    if (!user) return;
    const _trainingTemplateList = await fetchTrainingTemplateList(user.id);
    setTrainingTemplateList(_trainingTemplateList);
  };

  const onClickAddSeedTrainingTemplate = async () => {
    if (!user) return;
    await insertSeedTrainingTemplate(user.id);
    await refetchTrainingTemplateList();
  };

  const onClickCreateTrainingTemplate = () => {
    setType('create');
    setPrevTrainingTemplate(null);
    onOpen();
  };

  const onClickEditTrainingTemplate = (trainingTemplate: TrainingTemplate) => {
    setType('edit');
    setPrevTrainingTemplate(trainingTemplate);
    onOpen();
  };

  useEffect(() => {
    void refetchTrainingTemplateList();
  }, [user]);

  return (
    <>
      <Flex direction="column" gap="20px" w="full">
        <Flex>
          <Text fontSize="2xl" fontWeight="semibold">
            トレーニングテンプレート
          </Text>
          <Spacer />
          <Flex gap="8px">
            {isEmulating && (
              <PrimaryButton onClick={() => void onClickAddSeedTrainingTemplate()} gap="8px">
                <Icon as={MdAdd as IconType} boxSize="20px" />
                <Text fontSize="sm">シード追加</Text>
              </PrimaryButton>
            )}
            <PrimaryButton onClick={onClickCreateTrainingTemplate} gap="8px">
              <Icon as={MdAdd as IconType} boxSize="20px" />
              <Text fontSize="sm">追加</Text>
            </PrimaryButton>
          </Flex>
        </Flex>
        <Flex direction="column" gap="20px" align="center">
          <VStack w="full" spacing="12px">
            {trainingTemplateList.length !== 0 ? (
              trainingTemplateList.map((trainingTemplate) => (
                <TrainingTemplateCard
                  key={trainingTemplate.id}
                  name={trainingTemplate.name}
                  exerciseIdList={trainingTemplate.exerciseIdList}
                  onClick={() => onClickEditTrainingTemplate(trainingTemplate)}
                />
              ))
            ) : (
              <Flex px="40px" py="120px">
                <Text fontSize="lg" fontWeight="semibold">
                  データがありません
                </Text>
              </Flex>
            )}
          </VStack>
        </Flex>
      </Flex>
      <TrainingTemplateCrudModal
        isOpen={isOpen}
        onClose={onClose}
        type={type}
        prevTrainingTemplate={prevTrainingTemplate}
        refetchTrainingTemplateList={refetchTrainingTemplateList}
      />
    </>
  );
};

export default TrainingTemplateSettingsPage;
