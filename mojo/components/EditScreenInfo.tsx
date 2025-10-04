import { Text, View } from 'react-native';

export const EditScreenInfo = ({ path }: { path: string }) => {
  const title = 'Open up the code for this screen:';
  const description =
    'Change any of the text, save the file, and your app will automatically update.';

  return (
    <View>
      <View className="items-center mx-12">
        <Text className="text-lg leading-6 text-center text-foreground">{title}</Text>
        <View className="rounded-md px-1 my-2">
          <Text className="text-foreground">{path}</Text>
        </View>
        <Text className="text-lg leading-6 text-center text-foreground">{description}</Text>
      </View>
    </View>
  );
};