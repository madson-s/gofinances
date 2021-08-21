import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import { Container, Icon, Title } from './styles';

const icon = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle',
}

interface Props extends TouchableOpacityProps {
  isActive: boolean;
  type: 'up' | 'down';
  title: string;
}

export function TransactionTypeButton({ isActive, title, type, ...rest }: Props) {
  return (
    <Container isActive={isActive} type={type} {...rest}>
      <Icon name={icon[type]} type={type}/>
      <Title isActive={isActive} type={type}>{title}</Title>
    </Container>
  )
}
