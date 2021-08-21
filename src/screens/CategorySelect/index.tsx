import React from 'react';

import { Header } from '../../components/Header';
import { Category } from '../../components/Category';
import { Button } from '../../components/Forms/Button';

import { categories } from '../../utils/categories';

import { Container, Categories, Separator, Footer } from './styles';


export interface Category {
  key: string;
  name: string;
}

interface Props {
  category: Category;
  setCategory: (category: Category) => void;
  closeSelectCategory: () => void;
}

export function CategorySelect({ category, setCategory, closeSelectCategory}: Props) {
  return (
    <Container>
      <Header title="Categorias" />
      <Categories
        keyExtractor={(item) => item.key}
        data={categories}
        renderItem={({ item }) =>
          <Category
            data={item}
            isActive={item.key === category.key}
            onPress={() => setCategory(item)}
          />
        }
        ItemSeparatorComponent={() => <Separator/>}
      />
      <Footer>
        <Button title="Selecionar" onPress={closeSelectCategory}/>
      </Footer>
    </Container>
  )
}
