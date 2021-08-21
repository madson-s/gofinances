import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { SvgProps } from 'react-native-svg';
import { Container, Image, Title } from './styles';

interface Props extends RectButtonProps{
  title: string;
  svg: React.FC<SvgProps>;
  onPress: () => void;
}

export function SignInSocialButton({title, svg: Svg, onPress}: Props) {
  return (
    <Container onPress={onPress}>
      <Image>
        <Svg />
      </Image>
      <Title>{title}</Title>
    </Container>
  );
}
