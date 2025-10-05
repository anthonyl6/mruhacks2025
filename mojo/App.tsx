import { useEffect, useState, useCallback } from 'react';
import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HorizontalSideScroll } from './components/slide';
import * as Linking from 'expo-linking';
import DeeplinkModal from 'components/DeeplinkModal';

import './global.css';

export default function App() {
  const [deeplinkData, setDeeplinkData] = useState<{
    visible: boolean;
    type: 'request' | 'send' | null;
    id: string | null;
  }>({
    visible: false,
    type: null,
    id: null,
  });

  const handleDeeplink = useCallback((url: string) => {
    try {
      const parsedUrl = Linking.parse(url);

      if (parsedUrl.scheme === 'mojo') {
        const path = parsedUrl.hostname;
        const queryParams = parsedUrl.queryParams;

        if (path === 'request' && queryParams?.id) {
          setDeeplinkData({
            visible: true,
            type: 'request',
            id: queryParams.id as string,
          });
        } else if (path === 'send' && queryParams?.id) {
          setDeeplinkData({
            visible: true,
            type: 'send',
            id: queryParams.id as string,
          });
        }
      }
    } catch (error) {
      console.error('Error parsing deeplink:', error);
    }
  }, []);

  useEffect(() => {
    // Handle initial URL if app was opened via deeplink
    const handleInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeeplink(initialUrl);
      }
    };

    // Handle URL changes when app is already running
    const handleUrlChange = (event: { url: string }) => {
      handleDeeplink(event.url);
    };

    // Set up listeners
    const subscription = Linking.addEventListener('url', handleUrlChange);

    // Check for initial URL
    handleInitialURL();

    return () => {
      subscription?.remove();
    };
  }, [handleDeeplink]);

  const closeModal = () => {
    setDeeplinkData({
      visible: false,
      type: null,
      id: null,
    });
  };

  return (
    <SafeAreaProvider>
      <ScreenContent />
      <StatusBar style="light" />
      {deeplinkData.visible && deeplinkData.type && deeplinkData.id && (
        <DeeplinkModal
          onClose={closeModal}
          type={deeplinkData.type}
          id={deeplinkData.id}
        />
      )}
    </SafeAreaProvider>
  );
}
