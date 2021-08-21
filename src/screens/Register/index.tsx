import React, { useState } from 'react';
import { Modal, TouchableWithoutFeedback, Keyboard,  Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { CategorySelect, Category } from '../CategorySelect';

import { Header } from '../../components/Header';
import { Button } from '../../components/Forms/Button';
import { ControlledInput } from '../../components/Forms/ControlledInput';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';

import {
  Container,
  Form,
  Fields,
  TransactionType,
} from './styles';
import { useAuth } from '../../hooks/auth';

interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup
    .string()
    .required('Nome é obrigatório'),
  amount: Yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
    .required('Valor é obrigatório'),
});

export function Register({ navigation }) {
  const [transactionType, setTransactionType] = useState('');
  const [category, setCategory] = useState({key: 'category', name: 'Categoria',});
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const { user } = useAuth();

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });

  function handleTransactionTypeSelect(type: 'positive' | 'negative') {
    setTransactionType(type);
  }

  function handleCategoryModalOpen() {
    setShowCategoryModal(true);
  }


  function handleCategoryModalClose() {
    setShowCategoryModal(false);
  }

  function handleSelectCategory(category: Category) {
    setCategory(category);
  }

  async function handleRegister(form: FormData) {
    if (!transactionType) {
      return Alert.alert("Selecione o tipo da tansação");
    }

    if (category.key === 'category') {
      return Alert.alert("Selecione a categoria");
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      category: category.key,
      type: transactionType,
      date: new Date(),
    }

    try {
      const dataKey = `@gofinances:transactions_user:${user.id}`;

      const data = await AsyncStorage.getItem(dataKey);

      const currenctData = data ? JSON.parse(data) : [];

      const formattedData = [
        ...currenctData,
        newTransaction,
      ];

      await AsyncStorage.setItem(dataKey, JSON.stringify(formattedData));
      reset();
      setTransactionType('');
      setCategory({ key: 'category', name: 'Categoria', });
      navigation.navigate('Listagem');
    }
    catch {
      Alert.alert("Não foi possível salvar");
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header title="Cadastro" />
        <Form>
          <Fields>
            <ControlledInput
              control={control}
              name="name"
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />

            <ControlledInput
              control={control}
              name="amount"
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <TransactionType>
              <TransactionTypeButton
                type="up"
                title="Income"
                onPress={() => handleTransactionTypeSelect('positive')}
                isActive={transactionType === "positive"}
              />
              <TransactionTypeButton
                type="down"
                title="Outcome"
                onPress={() => handleTransactionTypeSelect('negative')}
                isActive={transactionType === "negative"}
              />
            </TransactionType>
            <CategorySelectButton title={category.name} onPress={handleCategoryModalOpen}/>
          </Fields>
          <Button title="Registrar" onPress={handleSubmit(handleRegister)}/>
        </Form>

        <Modal
          visible={showCategoryModal}
          animationType="slide"
        >
          <CategorySelect
            category={category}
            setCategory={handleSelectCategory}
            closeSelectCategory={handleCategoryModalClose}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}
