import { useState } from 'react';
import { Platform, Pressable, Text, TextInput, View, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabGroup } from './TabGroup';
import { LinkIcon } from 'lucide-react-native';
import { HorizontalSideScroll } from './slide';  // Adjust path if needed

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Sample user data
const users = [
  { email: 'alice@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
  { email: 'bob@example.com',   avatar: 'https://i.pravatar.cc/150?img=2' },
  { email: 'brady@example.com', avatar: 'https://i.pravatar.cc/150?img=3' },
  { email: 'herc@example.com', avatar: 'https://i.pravatar.cc/150?img=4' },
  { email: 'davo@example.com', avatar: 'https://i.pravatar.cc/150?img=5' },
  { email: 'serana@example.com', avatar: 'https://i.pravatar.cc/150?img=6' },
  { email: 'cheese@example.com', avatar: 'https://i.pravatar.cc/150?img=7' },
  { email: 'justcats@example.com', avatar: 'https://i.pravatar.cc/150?img=8' },
];

export const ScreenContent = () => {
  const isAndroid15 = Platform.OS === 'android' && Platform.Version >= 35;
  const [selectedTab, setSelectedTab] = useState<'send' | 'request'>('send');
  const tabs = [
    { label: 'Send',    value: 'send'    as const, selectedColor: '#db8a74' },
    { label: 'Request', value: 'request' as const, selectedColor: '#9b96b0' },
  ];
  const WrapperComponent = isAndroid15 ? View : SafeAreaView;

  return (
    <View className="bg-background flex flex-1 items-center justify-center">
      <WrapperComponent className="flex w-screen flex-1 flex-col items-start justify-start pt-16">
        <View className="flex w-full flex-1 flex-col items-center justify-start">
          <Text className="text-foreground text-5xl">Mojo</Text>
          <TabGroup selectedTab={selectedTab} onSelect={setSelectedTab} tabs={tabs} />

          {/* Email Input + Copy Button */}
          <View className="mx-12 flex flex-row items-center justify-center gap-2">
            <TextInput
              inputMode="email"
              className="placeholder:text-foreground/50 text-foreground flex-1 overflow-hidden rounded-full bg-[#212121] p-6 px-6"
              placeholder="email@example.com"
            />
            <Pressable
              className="items-center justify-center overflow-hidden rounded-full bg-[#212121] p-5 transition-all duration-300 active:bg-[#3f3f3f]"
              onPress={() => console.log('copy link to clipboard')}
            >
              <LinkIcon stroke={'#ffffff'} />
            </Pressable>
          </View>

          {/* Horizontal Profile Carousel */}
          <View className="mt-6 w-full items-center">
            <HorizontalSideScroll>
              {users.map((user, idx) => {
                const truncatedEmail = user.email.length > 8 
                  ? user.email.split('@')[0] 
                  : user.email;

                return (
                  <View
                    key={idx}
                    className="items-center py-4 -mx-[25px] bg-transparent"
                    style={{ width: SCREEN_WIDTH * 0.5 }}
                  >
                    <Image 
                      source={{ uri: user.avatar }} 
                      className="w-25 h-25 rounded-full border-2 border-white mb-2"
                    />
                    <Text className="text-base text-gray-300" numberOfLines={1}>
                      {truncatedEmail}
                    </Text>
                  </View>
                );
              })}
            </HorizontalSideScroll>
          </View>
        </View>
      </WrapperComponent>
    </View>
  );
};
