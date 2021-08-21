import React from "react";
import { TouchableOpacityProps } from "react-native";
import { DataCategoriesProps } from "../../utils/categories";

import { Container, Icon, Name } from './styles';

interface Props extends TouchableOpacityProps{
  data: DataCategoriesProps;
  isActive: boolean;
}

export const Category = ({ data, isActive, ...rest }: Props) => {
  return (
    <Container isActive={isActive} {...rest}>
      <Icon name={data.icon} />
      <Name>{data.name}</Name>
    </Container>
  )
}
