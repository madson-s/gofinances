import React, { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "styled-components";
import { useAuth } from "../../hooks/auth";
import { useFocusEffect } from "@react-navigation/native";

import {HighlightCard} from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";
import { Loading } from "../../components/Loading";

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  LogoutButton,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
} from "./styles";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTansaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  const { user, signOut } = useAuth();
  const theme = useTheme();

  function formatMoney(amount: Number) {
    return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(amount));
  }

  function getLastTransactionDate(collection: DataListProps[],  type: 'negative' | 'positive') {

    const collectionFilttered = collection
      .filter(transaction => transaction.type === type);

    if (!collectionFilttered.length) {
      return 0;
    }

    const lastTransaction = new Date(Math.max.apply(Math, collectionFilttered
      .map(transaction => new Date(transaction.date).getTime())));

    return Intl.DateTimeFormat('pt-BR', {
      month: 'long', day: 'numeric'
    }).format(lastTransaction);
  }

  async function loadData() {
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const data = await AsyncStorage.getItem(dataKey);
    const currenctData = data ? JSON.parse(data) : [];

    let entriesTotal = 0;
    let expensivesTotal = 0;

    const formattedData: DataListProps[] = currenctData.map((item: DataListProps) => {

      if (item.type === 'positive') {
        entriesTotal += Number(item.amount);
      }
      else {
        expensivesTotal += Number(item.amount);
      }

      const amount = formatMoney(Number(item.amount));

      const date = Intl.DateTimeFormat('pt-BR', {
        year: '2-digit', month: '2-digit', day: '2-digit',
      }).format(new Date(item.date));

      return {
        ...item,
        amount,
        date,
      }
    });

    const total = entriesTotal - expensivesTotal;

    const lastTransactionEntries = getLastTransactionDate(currenctData, 'positive');
    const lastTransactionExpensives = getLastTransactionDate(currenctData, 'negative');
    const totalInterval = lastTransactionExpensives === 0
      ? 'Não há transações'
      : `01 a ${lastTransactionEntries}`;

    setHighlightData({
      entries: {
        amount: formatMoney(entriesTotal),
        lastTansaction: lastTransactionEntries === 0
          ? 'Não há transações'
          : `Última entrada dia ${lastTransactionEntries}`,
      },
      expensives: {
        amount: formatMoney(expensivesTotal),
        lastTansaction: lastTransactionExpensives === 0
          ? 'Não há transações'
          :`Última saida dia ${lastTransactionExpensives}`,
      },
      total: {
        amount: formatMoney(total),
        lastTansaction: totalInterval,
      },
    });

    setTransactions(formattedData.reverse());
    setIsLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(useCallback(() => {
    loadData();
  }, []));

  return (
    <Container>
      {isLoading ? (
        <Loading />
      ): (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: user.photo}} />
                <User>
                  <UserGreeting>OLá,</UserGreeting>
                  <UserName >{user.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighlightCards>
            <HighlightCard
              title='Entrada'
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTansaction}
              type='up'
            />
            <HighlightCard
              title='Saida'
              amount={highlightData.expensives.amount}
              lastTransaction={highlightData.expensives.lastTansaction}
              type='down'
            />
            <HighlightCard
              title='Total'
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTansaction}
              type='total'
            />
          </HighlightCards>
          <Transactions>
            <Title>Listagem</Title>
            <TransactionList
              keyExtractor={item => item.id}
              data={transactions}
              renderItem={({ item }) => (
                <TransactionCard data={item} />
              )}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
