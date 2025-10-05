import { cn } from 'lib/util';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

export default function SendAndRequestModal({
  onClose,
  otherPartyDetails,
  type,
}: {
  onClose: () => void;
  otherPartyDetails: { name?: string; email?: string };
  type: 'send' | 'request';
}) {
  const [amount, setAmount] = useState(0);
  return (
    <View className="bg-background rel fixed inset-0 top-0 right-0 bottom-0 left-0 z-50 h-screen w-screen items-center justify-center">
      <View className="bg-background border-border relative mx-4 w-[90%] rounded-xl border p-8">
        <Pressable className="absolute top-6 right-6 bg-gray-800 rounded-full p-2" onPress={onClose}>
          <X size={20} color="#ffffff" />
        </Pressable>
        <Text className="text-foreground text-center text-xl font-medium">
          {type === 'send' ? 'Sending a payment to' : 'Requesting a payment from'}
        </Text>
        {otherPartyDetails.name && (
          <Text className="text-foreground text-center text-3xl font-bold">
            {otherPartyDetails.name?.charAt(0).toUpperCase() + otherPartyDetails.name?.slice(1)}
          </Text>
        )}
        <Text className="text-foreground/35 text-center text-lg">{otherPartyDetails.email}</Text>
        <View className="flex flex-row items-center justify-center">
          <Text className="text-foreground text-3xl">$</Text>
          <TextInput
            className="text-foreground text-3xl"
            value={amount.toString()}
            onChangeText={(text) => setAmount(Number(text))}
          />
        </View>
        <View className="flex flex-row items-center justify-center">
          <Pressable
            className={cn(
              'w-full rounded-full p-4',
              type === 'send' ? 'bg-sending-secondary' : 'bg-receiving-secondary'
            )}>
            <Text className="text-foreground text-center text-lg">
              {type === 'send' ? 'Send' : 'Request'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
