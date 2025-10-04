import { type ReactNode, useState } from 'react';
import { Platform, Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { TabGroup } from './TabGroup';

export const ScreenContent = () => {
  const isAndroid15 = Platform.OS === 'android' && Platform.Version >= 35;
  const [selectedTab, setSelectedTab] = useState('home');
  const tabs = [
    { label: 'Send', value: 'send' },
    { label: 'Request', value: 'request' },
  ];
  const WrapperComponent = isAndroid15 ? View : SafeAreaView;
  return (
    <View className="flex flex-1 items-center justify-center bg-background">
      <WrapperComponent className="flex-1 w-screen flex flex-col items-start justify-start pt-16">
        <View className="flex w-full flex-1 flex-col items-center justify-start">
          <Text className="text-foreground text-5xl">Mojo</Text>
          <TabGroup selectedTab={selectedTab} onSelect={setSelectedTab} tabs={tabs} />
        </View>
      </WrapperComponent>
    </View>
  );
};
