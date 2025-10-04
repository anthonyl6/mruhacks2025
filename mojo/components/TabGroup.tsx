import { Pressable, Text, View } from 'react-native';
import { cn } from '../lib/util';

type TabGroupProps = {
  selectedTab: 'send' | 'request';
  onSelect: (tab: 'send' | 'request') => void;
  tabs: {
    label: string;
    value: 'send' | 'request';
    selectedColor: string;
  }[];
};

export const TabGroup = ({ selectedTab, onSelect, tabs }: TabGroupProps) => {
  return (
    <View className="my-7 flex h-16 w-4/5 flex-row items-center justify-center gap-2 rounded-full bg-[#000000] p-2">
      {tabs.map((tab) => (
        <View
          key={tab.value}
          className={
            'h-full flex-1 items-center justify-center overflow-hidden rounded-full bg-[#212121]'
          }>
          <Pressable
            key={tab.value}
            onPress={() => onSelect(tab.value)}
            className={cn(
              'flex h-full w-full flex-1 items-center justify-center transition-all duration-300'
            )}
            style={{ backgroundColor: selectedTab === tab.value ? tab.selectedColor : '#212121' }}>
            <Text className="text-foreground w-full items-center justify-center text-center">
              {tab.label}
            </Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
};
