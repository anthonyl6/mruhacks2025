import { useState } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { TabGroup } from './TabGroup';
import { CameraIcon, LinkIcon } from 'lucide-react-native';

export const ScreenContent = () => {
  const isAndroid15 = Platform.OS === 'android' && Platform.Version >= 35;
  const [selectedTab, setSelectedTab] = useState('home');
  const tabs = [
    { label: 'Send', value: 'send' },
    { label: 'Request', value: 'request' },
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
              className="placeholder:text-foreground flex-1 items-center justify-center overflow-hidden rounded-md bg-[#212121] p-3"
              placeholder="Search"
            />
            <Pressable
              className="items-center justify-center overflow-hidden rounded-md bg-[#212121] p-2"
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
