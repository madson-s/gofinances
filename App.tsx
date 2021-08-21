import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from 'styled-components';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import { AuthProvider, useAuth } from './src/hooks/auth';

import { Routes } from './src/routes';

import theme from './src/global/styles/theme';

export default function App() {

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const { isLoading} = useAuth();

  if (!fontsLoaded || isLoading) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      {/* <TabRoutes/> */}
      <StatusBar style="light" />
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
}
