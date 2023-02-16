import { ThemeProvider } from 'styled-components/native';

import { ActivityIndicator } from 'react-native';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import theme from './src/global/styles/theme';

import { NavigationContainer } from '@react-navigation/native';

import { AppRoutes } from './src/routes/app.routes';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          {fontsLoaded ? <AppRoutes /> : <ActivityIndicator />}
        </NavigationContainer>
      </ThemeProvider>
    </>
  );
}
