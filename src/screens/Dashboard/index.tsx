import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';

import { useTheme } from 'styled-components';
import { useAuth } from '../../hooks/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadingContainer,
} from './styles';

export type DataListProps = TransactionCardProps & {
  id: string;
};

type HighlightDataProps = {
  amount: string;
  lastTransaction: string;
};

type HighlightData = {
  entries: HighlightDataProps;
  expensive: HighlightDataProps;
  total: HighlightDataProps;
};

export function Dashboard() {
  const [transaction, setTransaction] = useState<DataListProps[]>([]);
  const [highlighData, setHighlighData] = useState<HighlightData>({} as HighlightData);
  const [isLoading, setIsLoading] = useState(true);

  const theme = useTheme();
  const { signOut, user } = useAuth();

  const dataKey = `@gofinances:transactions_user:${user.id}`;

  function getLastTransactionDate(collection: DataListProps[], type: 'positive' | 'negative') {
    const collectionFiltered = collection.filter((transaction) => transaction.type === type);
    if (collectionFiltered.length === 0) {
      return 0;
    }

    const lastTransactions = new Date(
      Math.max.apply(
        Math,
        collectionFiltered.map((transaction) => new Date(transaction.date).getTime())
      )
    );

    return `${lastTransactions.getDate()} de ${lastTransactions.toLocaleString('pt-BR', {
      month: 'long',
    })}`;
  }

  async function loadTransitions() {
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionFormatted: DataListProps[] = transactions.map((item: DataListProps) => {
      if (item.type === 'positive') {
        entriesTotal += Number(item.amount);
      } else {
        expensiveTotal += Number(item.amount);
      }

      const amount = Number(item.amount).toLocaleString('pt-Br', {
        style: 'currency',
        currency: 'BRL',
      });

      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount,
        date,
        type: item.type,
        category: item.category,
      };
    });

    setTransaction(transactionFormatted);

    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpensive = getLastTransactionDate(transactions, 'negative');
    const totalInterval =
      lastTransactionExpensive === 0 ? 'Não há transações' : `01 a ${lastTransactionExpensive}`;

    const total = entriesTotal - expensiveTotal;
    setHighlighData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction:
          lastTransactionEntries === 0
            ? 'Não há transações'
            : `Última entrada dia ${lastTransactionEntries}`,
      },
      expensive: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction:
          lastTransactionExpensive === 0
            ? 'Não há transações'
            : `Última saída dia ${lastTransactionExpensive}`,
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: totalInterval,
      },
    });
    setIsLoading(false);
  }

  useEffect(() => {
    loadTransitions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransitions();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadingContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: user.photo }} />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighlightCards>
            <HighlightCard
              title={'Entradas'}
              amount={highlighData.entries.amount}
              lastTransaction={highlighData.entries.lastTransaction}
              type="up"
            />
            <HighlightCard
              title={'Saídas'}
              amount={highlighData.expensive.amount}
              lastTransaction={highlighData.expensive.lastTransaction}
              type="down"
            />
            <HighlightCard
              title={'Total'}
              amount={highlighData.total.amount}
              lastTransaction={highlighData.total.lastTransaction}
              type="total"
            />
          </HighlightCards>
          <Transactions>
            <Title>Listagem</Title>
            <TransactionList
              data={transaction}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
