'use client';

import { Flex } from '@chakra-ui/layout';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { ChartDataset } from 'chart.js';
import { useAtomValue } from 'jotai';
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { fetchWeighLogList } from '@/function/weighLog';
import { userAtom } from '@/globalState/user';
import { formatNumTimeToMonthDay } from '@/function/day';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// 0~28のリストを作成
const createHorizontalList = (days: number) => {
  const horizontalList = [];
  for (let i = 0; i < days; i++) {
    horizontalList.push(i);
  }
  return horizontalList;
};

const displayOptions = [
  {
    name: 'week',
    holizontalList: createHorizontalList(7).reverse(),
  },
  {
    name: 'month',
    holizontalList: createHorizontalList(31).reverse(),
  },
  {
    name: '3month',
    holizontalList: createHorizontalList(31 * 3).reverse(),
  },
];

interface ChartFieldProps {
  rangeName: string;
}

const ChartField = (props: ChartFieldProps) => {
  const { rangeName } = props;
  const user = useAtomValue(userAtom);
  const [labels, setLabels] = useState<string[]>([]);
  const [datasets, setDatasets] = useState<ChartDataset<'line'>[]>([]);
  const holizontalList = displayOptions.find((option) => option.name === rangeName)?.holizontalList;

  const fetchDisplayData = async () => {
    console.log('user: ', user);
    if (!user || !holizontalList) return;
    const _weighLogList = await fetchWeighLogList(user.id);
    // 今日から遡って7日分のデータを取得する
    const _labels = holizontalList.map((num) => formatNumTimeToMonthDay(Date.now() - 1000 * 60 * 60 * 24 * num));
    const _weightData = _labels.map((label) => {
      const weighLog = _weighLogList.find((weighLog) => formatNumTimeToMonthDay(weighLog.weighDate) === label);
      if (weighLog) {
        return weighLog.weight;
      } else {
        return null;
      }
    });
    const _fatPercentageData = _labels.map((label) => {
      const weighLog = _weighLogList.find((weighLog) => formatNumTimeToMonthDay(weighLog.weighDate) === label);
      if (weighLog) {
        return weighLog.fatPercentage;
      } else {
        return null;
      }
    });
    const _datasets = [
      {
        label: '体重(kg)',
        data: _weightData,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        spanGaps: true,
        tension: 0.2,
        pointRadius: 5,
      },
      {
        label: '体脂肪率(%)',
        data: _fatPercentageData,
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
        spanGaps: true,
        tension: 0.2,
        pointRadius: 5,
      },
    ];
    setLabels(_labels);
    setDatasets(_datasets);
  };

  useEffect(() => {
    void fetchDisplayData();
  }, [user, holizontalList]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Flex align="center" justify="center" w="full" p="20px" h="400px">
      <Line
        height={360}
        options={options}
        data={{
          labels: labels,
          datasets: datasets,
        }}
      />
    </Flex>
  );
};

export default ChartField;
