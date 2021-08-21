import styled, {css} from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

interface IsActiveProps {
  isActive: boolean;
}

export const Container = styled.TouchableOpacity<IsActiveProps>`
  width: 100%;
  flex-direction: row;
  padding: ${RFValue(16)}px;
  align-items: center;
  ${({ isActive, theme }) =>
    isActive && css`background-color: ${theme.colors.secondary_light};`
  };
`;

export const Icon = styled(Feather)`
  font-size: ${RFValue(20)}px;
  margin-right: 16px;
`;

export const Name = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
`;
