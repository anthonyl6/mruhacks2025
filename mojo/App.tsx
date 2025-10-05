import { useEffect, useState, useCallback } from 'react';
import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import DeeplinkModal from 'components/DeeplinkModal';

import './global.css';
import { AuthProvider, useAuth } from 'providers/auth-provider';
import { Loader2Icon } from 'lucide-react-native';
import Login from 'components/Login';
import { View } from 'react-native';

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
      <AuthProvider>
        <AppContent />
        <StatusBar style="light" />
        {deeplinkData.visible && deeplinkData.type && deeplinkData.id && (
          <DeeplinkModal onClose={closeModal} type={deeplinkData.type} id={deeplinkData.id} />
        )}
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <View className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center animate-spin">
        <Loader2Icon size={40} className="animate-spin" color="white" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }
  return <ScreenContent />;
};
