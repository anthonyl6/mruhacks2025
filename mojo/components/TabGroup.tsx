import { Pressable, Text, View } from 'react-native';
import { cn } from '../lib/util';

type TabGroupProps = {
  selectedTab: 'send' | 'request';
  onSelect: (tab: 'send' | 'request') => void;
  tabs: {
    label: string;
    value: 'send' | 'request';
  }[];
};

export const TabGroup = ({ selectedTab, onSelect, tabs }: TabGroupProps) => {
  return (
    <View className="my-7 flex h-12 w-4/5 flex-row items-center justify-center gap-2 rounded-lg bg-[#3f3f3f] p-2">
      {tabs.map((tab) => (
        <View
          key={tab.value}
          className="h-full flex-1 items-center justify-center overflow-hidden rounded-md bg-[#212121]">
          <Pressable
            key={tab.value}
            onPress={() => onSelect(tab.value)}
            className={cn(
              'flex h-full w-full flex-1 items-center justify-center',
              selectedTab === tab.value && 'bg-background'
            )}>
            <Text className="text-foreground w-full items-center justify-center text-center">
              {tab.label}
            </Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
};
