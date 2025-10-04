import { Pressable, Text, View } from 'react-native';
import { cn } from '../lib/util';

type TabGroupProps = {
  selectedTab: string;
  onSelect: (tab: string) => void;
  tabs: {
    label: string;
    value: string;
  }[];
};

export const TabGroup = ({ selectedTab, onSelect, tabs }: TabGroupProps) => {
  return (
    <View className="my-7 flex h-12 w-4/5 flex-row bg-[#3f3f3f] rounded-lg justify-center items-center gap-2 p-2">
      {tabs.map((tab) => (
        <View key={tab.value} className="flex-1 bg-[#212121] rounded-md justify-center items-center h-full overflow-hidden">
          <Pressable
            key={tab.value}
            onPress={() => onSelect(tab.value)}
            className={cn(
              'flex flex-1 items-center justify-center h-full w-full',
              selectedTab === tab.value && 'bg-background'
            )}>
            <Text className="text-foreground w-full justify-center items-center text-center">{tab.label}</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
};
