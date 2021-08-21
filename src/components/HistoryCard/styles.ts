import { RFValue } from 'react-native-responsive-fontsize';

import styled from 'styled-components/native';
interface ColorProps {
  color: string;
}

export const Container = styled.View<ColorProps>`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.shape};
  padding: 12px 24px;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 5px;
  border-left-width: 4px;
  border-left-color: ${({ color }) => color};
  margin-bottom: 8px;
`;

export const Title = styled.Text`
  font-size: ${RFValue(15)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
`;

export const Amount = styled.Text`
  font-size: ${RFValue(15)}px;
  font-family: ${({ theme }) => theme.fonts.bold};
`;
