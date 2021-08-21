import React, { useState } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import { Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg'
import LogoSvg from '../../assets/logo.svg'
import { SignInSocialButton } from '../../components/SignInSocialButton';

import { useAuth } from '../../hooks/auth';

import theme from '../../global/styles/theme';

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrappper
} from './styles';

export function SignIn() {

  const [isLoading, setIsLoading] = useState(false);
  const { user, signInWithGoogle, signInWithApple} = useAuth();

  async function handleSignInWithGoogle() {
    setIsLoading(true);
    try {
      return await signInWithGoogle();
    } catch(error) {
      console.log(error)
      Alert.alert("Não foi possível conectar com a conta Google");
    }
    setIsLoading(false);
  }

  async function handleSignInWithApple() {
    setIsLoading(true);
    try {
      return await signInWithApple();
    } catch(error) {
      console.log(error)
      Alert.alert("Não foi possível conectar com a conta Google");
    }
    setIsLoading(false);
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)}/>
          <Title>
            Controle suas{'\n'}
            finanças de forma{'\n'}
            muito simples
          </Title>
        </TitleWrapper>
        <SignInTitle>
          Faça seu login com{'\n'}
          uma das contas abaixo
        </SignInTitle>
      </Header>
      <Footer>
        <FooterWrappper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
          {Platform.OS === 'ios' &&
            <SignInSocialButton
              title="Entrar com Apple"
              svg={AppleSvg}
              onPress={handleSignInWithApple}
            />
          }
        </FooterWrappper>
        {isLoading && <ActivityIndicator color={theme.colors.shape} size="large"/>}
      </Footer>
    </Container>
  )
}
