import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HorizontalSideScroll } from './components/slide';

import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <ScreenContent />
      <StatusBar style="inverted" />
    </SafeAreaProvider>
  );
}
