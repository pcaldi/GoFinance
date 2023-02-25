import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';
import { VictoryPie } from 'victory-native';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useAuth } from '../../hooks/auth';
import { useTheme } from 'styled-components';
import { useFocusEffect } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { HistoryCard } from '../../components/HistoryCard';
import {
  Container,
  Title,
  Header,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadingContainer,
} from './styles';

import { categories } from '../../utils/categories';
import { ActivityIndicator } from 'react-native';

type TransactionDataProps = {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
};

type CategoryDataProps = {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
};

export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [totalByCategories, setTotalByCategories] = useState<CategoryDataProps[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const theme = useTheme();
  const { user } = useAuth();

  function handleChangeDate(action: 'next' | 'prev') {
    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function LoadData() {
    setIsLoading(true);
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensive = responseFormatted.filter(
      (expensive: TransactionDataProps) =>
        expensive.type === 'negative' &&
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
    );

    const expensiveTotal = expensive.reduce(
      (accumulator: number, expensive: TransactionDataProps) => {
        return accumulator + Number(expensive.amount);
      },
      0
    );

    const totalByCategory: CategoryDataProps[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      expensive.forEach((expensive: TransactionDataProps) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });
      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        const percent = `${((categorySum / expensiveTotal) * 100).toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormatted,
          percent,
        });
      }
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      LoadData();
    }, [selectedDate])
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadingContainer>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleChangeDate('prev')}>
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>{format(selectedDate, 'MMMM, yyy', { locale: ptBR })}</Month>

            <MonthSelectButton onPress={() => handleChangeDate('next')}>
              <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie
              data={totalByCategories}
              colorScale={totalByCategories.map((category) => category.color)}
              style={{
                labels: { fontSize: RFValue(18), fontWeight: 'bold', fill: theme.colors.shape },
              }}
              labelRadius={50}
              x="percent"
              y="total"
            />
          </ChartContainer>
          {totalByCategories.map((item) => (
            <HistoryCard
              key={item.key}
              title={item.name}
              amount={item.totalFormatted}
              color={item.color}
            />
          ))}
        </Content>
      )}
    </Container>
  );
}
