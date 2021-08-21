import styled, {css} from "styled-components/native";
import { TouchableOpacity } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

interface TypeProps {
  type: 'up' | 'down';
}

interface IsActiveProps {
  isActive: boolean;
  type: 'up' | 'down';
}

export const Container = styled(TouchableOpacity)<IsActiveProps>`
  width: 48%;
  flex-direction: row;
  padding: 16px 0;
  align-items: center;
  justify-content: center;
  border-width: ${({ isActive }) => isActive ? 0 : 1.5}px;
  border-style: solid;
  border-color: ${({theme}) => theme.colors.text};
  border-radius: 5px;
  margin: 8px 0 16px 0;

  ${({ isActive, type }) => isActive && type === 'up' && css`
    background-color: ${({theme}) => theme.colors.success_light};
  `};

  ${({ isActive, type }) => isActive && type === 'down' && css`
    background-color: ${({theme}) => theme.colors.attention_light};
  `};
`;

export const Icon = styled(Feather)<TypeProps>`
  color: ${({ theme, type }) =>
    type === 'up' ? theme.colors.success : theme.colors.attention};
  font-size: ${RFValue(24)}px;
  margin-right: 16px;
`;

export const Title = styled.Text<IsActiveProps>`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;

  color: ${({theme}) => theme.colors.text};

  ${({ isActive, type }) => isActive && type === 'up' && css`
    color: ${({theme}) => theme.colors.success_light};
  `};

  ${({ isActive, type }) => isActive && type === 'down' && css`
    color: ${({theme}) => theme.colors.attention_light};
  `};
`;
