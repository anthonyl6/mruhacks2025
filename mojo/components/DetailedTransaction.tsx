import { View, Text, Pressable } from 'react-native';
import { XIcon } from 'lucide-react-native';

export default function DetailedTransaction({
  onClose,
  transactionDetails,
}: {
  onClose: () => void;
  transactionDetails: {
    currency: string;
    amount: number;
    date: string;
    description: string;
    from: string;
  };
}) {
  return (
    <View className="bg-background fixed top-0 left-0 h-screen w-screen items-center justify-center">
      <View className="bg-background border-border relative mx-4 flex w-[90%] flex-col items-center justify-center rounded-xl border p-8">
        <Pressable
          className="absolute top-6 right-6 rounded-full bg-gray-800 p-2"
          onPress={onClose}>
          <XIcon size={20} color="#ffffff" />
        </Pressable>
        <Text className="text-foreground text-center text-xl font-medium">
          {transactionDetails.from} {transactionDetails.amount > 0 ? 'sent' : 'received'}{' '}
        </Text>
        <Text className="text-foreground text-center text-2xl">
          {transactionDetails.currency} ${Math.abs(transactionDetails.amount / 100).toFixed(2)}
        </Text>
        {transactionDetails.amount > 0 && (
          <Text className="text-foreground text-center text-lg">to you</Text>
        )}
        {transactionDetails.amount < 0 && (
          <Text className="text-foreground text-center text-lg">from you</Text>
        )}
        <Text className="text-foreground text-center text-sm">Date: {transactionDetails.date}</Text>
        <Text className="text-foreground text-center text-lg">
          {transactionDetails.description}
        </Text>
        <Text className="text-foreground text-center text-lg">{transactionDetails.from}</Text>
      </View>
    </View>
  );
}
