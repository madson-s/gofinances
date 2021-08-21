import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useCallback } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect } from "@react-navigation/native";
import { addMonths, subMonths, format} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Header } from '../../components/Header';
import { useTheme } from "styled-components";
import { VictoryPie } from 'victory-native';

import {
  Container,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
} from "./styles";

import { HistoryCard } from "../../components/HistoryCard";

import { categories } from "../../utils/categories";

import { TransactionCardProps } from "../../components/TransactionCard";
import { Loading } from '../../components/Loading';
import { useAuth } from '../../hooks/auth';

interface DataListProps extends TransactionCardProps {
  id: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: string;
  color: string;
  percent: number;
  percentFormatted: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

  const { user } = useAuth();

  const theme = useTheme();

  function handleDateChange(action: 'next' | 'prev') {
    if (action === 'next') {
      setSelectedDate(prevState => addMonths(prevState, 1))
    } else {
      setSelectedDate(prevState => subMonths(prevState, 1))
    }
    setIsLoading(true);
  }

  async function loadData() {
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensives: DataListProps[] = responseFormatted
      .filter((expensive: DataListProps) =>
        expensive.type === 'negative' &&
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
      );

    const expensivesTotal = expensives
      .reduce((accumulator: number, expensive: DataListProps) => {
        return accumulator += Number(expensive.amount);
      }, 0);

    const totalByCategory = [];

    categories.forEach(category => {
      let categorySum = 0;
      expensives.forEach(expensive => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      })
      if (categorySum > 0) {
        const total = Intl.NumberFormat('pt-BR', {
          style: 'currency', currency: 'BRL'
        }).format(categorySum);

        const percent = (categorySum / expensivesTotal * 100);
        const percentFormatted = `${percent.toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          color: category.color,
          name: category.name,
          total,
          percent,
          percentFormatted,
        })
      }
    })

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, [selectedDate]))

  return (
    <Container>
      <Header title="Resumo por categoria" />

      <Content
        horizontal={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: useBottomTabBarHeight(),
        }}
      >
        <MonthSelect>
          <MonthSelectButton onPress={() => handleDateChange('prev')}>
            <MonthSelectIcon name="chevron-left"/>
          </MonthSelectButton>
          <Month>{format(selectedDate, 'MMMM, yyyy', {locale: ptBR})}</Month>
          <MonthSelectButton onPress={() => handleDateChange('next')}>
            <MonthSelectIcon name="chevron-right"/>
          </MonthSelectButton>
        </MonthSelect>

        {isLoading ? (
          <Loading />
        ) : (
          <>
            <ChartContainer>
            <VictoryPie
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: 'bold',
                  fill: theme.colors.shape,
                }
              }}
              labelRadius={100}
              data={totalByCategories}
              colorScale={totalByCategories.map(category => category.color)}
              x="percentFormatted" y="percent" />
            </ChartContainer>
            {totalByCategories.map(category => (
              <HistoryCard key={category.key} color={category.color} title={category.name} amount={category.total}/>
            ))}
          </>
        )}

      </Content>
    </Container>
  )
}
