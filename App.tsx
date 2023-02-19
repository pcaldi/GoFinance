import 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

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
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppRoutes } from './src/routes/app.routes';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          {fontsLoaded ? <AppRoutes /> : <ActivityIndicator />}
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
