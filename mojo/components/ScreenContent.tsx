import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenContentProps = {
  title: string;
  children?: ReactNode;
};

export const ScreenContent = ({ children }: ScreenContentProps) => {
  return (
    <View className="bg-background flex flex-1 items-center justify-center">
      <SafeAreaView>
        <Text className="text-foreground flex-1 text-5xl">Mojo</Text>
        <View className="bg-foreground my-7 h-[1px] w-4/5" />
        {children}
      </SafeAreaView>
    </View>
  );
};
