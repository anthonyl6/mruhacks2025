import { useState } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { TabGroup } from './TabGroup';
import { LinkIcon } from 'lucide-react-native';

export const ScreenContent = () => {
  const isAndroid15 = Platform.OS === 'android' && Platform.Version >= 35;
  const [selectedTab, setSelectedTab] = useState<'send' | 'request'>('send');
  const tabs = [
    { label: 'Send', value: 'send' as const },
    { label: 'Request', value: 'request' as const },
  ];
  const WrapperComponent = isAndroid15 ? View : SafeAreaView;
  return (
    <View className="bg-background flex flex-1 items-center justify-center">
      <WrapperComponent className="flex w-screen flex-1 flex-col items-start justify-start pt-16">
        <View className="flex w-full flex-1 flex-col items-center justify-start">
          <Text className="text-foreground text-5xl">Mojo</Text>
          <TabGroup selectedTab={selectedTab} onSelect={setSelectedTab} tabs={tabs} />
          <View className="mx-12 flex flex-row items-center justify-center gap-2">
            <TextInput
              inputMode="email"
              className="placeholder:text-foreground/50 text-foreground flex-1 items-center justify-center overflow-hidden rounded-full bg-[#212121] p-6 px-6"
              placeholder="email@example.com"
            />
            <Pressable
              className="items-center justify-center overflow-hidden rounded-full bg-[#212121] p-5 transition-all duration-300 active:bg-[#3f3f3f]"
              onPress={() => {
                console.log('search');
              }}>
              <LinkIcon stroke={'#ffffff'} />
            </Pressable>
          </View>
        </View>
      </WrapperComponent>
    </View>
  );
};
