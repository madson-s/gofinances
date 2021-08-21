import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { DataCategoriesProps } from '../../utils/categories';
import { getBottomSpace } from 'react-native-iphone-x-helper';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background};
`;

export const Header = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};
  width: 100%;
  height: ${RFValue(113)}px;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 19px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(18)}px;
  color: ${({theme}) => theme.colors.shape};
`;

export const Categories = styled(
  FlatList as new () => FlatList<DataCategoriesProps>
).attrs({
  style: { flex: 1, width: "100%", },
})`

`;

export const Separator = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${({theme}) => theme.colors.text};
`;


export const Footer = styled.View`
  width: 100%;
  margin-bottom: ${getBottomSpace}px;
`;
