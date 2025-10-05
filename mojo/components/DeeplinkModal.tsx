import { View, Text, Pressable } from 'react-native';
import { X, Send, Download } from 'lucide-react-native';
import { cn } from 'lib/util';

type DeeplinkModalProps = {
  onClose: () => void;
  type: 'request' | 'send';
  id: string;
};

export default function DeeplinkModal({ onClose, type, id }: DeeplinkModalProps) {
  const isRequest = type === 'request';
  const title = isRequest ? 'Payment Request' : 'Send Payment';
  const description = isRequest
    ? `You have received a payment request with ID: ${id}`
    : `You are about to send a payment with ID: ${id}`;
  const icon = isRequest ? Download : Send;
  const IconComponent = icon;

  return (
    <View className="fixed inset-0 top-0 right-0 bottom-0 left-0 z-50 h-full w-full">
      <View className="bg-opacity-50 flex-1 items-center justify-center bg-black">
        <View className="bg-background border-border mx-4 rounded-xl border p-8">
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                className={cn(
                  'h-10 w-10 items-center justify-center rounded-full',
                  isRequest ? 'bg-receiving-secondary' : 'bg-sending-secondary'
                )}>
                <IconComponent size={20} color={isRequest ? '#9b96b0' : '#db8a74'} />
              </View>
              <Text className="text-foreground ml-3 text-lg font-semibold">{title}</Text>
            </View>
            <Pressable
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full bg-black">
              <X size={16} color="#ffffff" />
            </Pressable>
          </View>

          {/* Content */}
          <View className="mb-6">
            <Text className="mb-4 text-base text-gray-600">{description}</Text>
            <View className="rounded-t-lg bg-gray-950 p-3">
              <Text className="mb-1 text-sm text-gray-500">Transaction ID</Text>
              <Text className="font-mono text-sm text-gray-200">{id}</Text>
            </View>
            <View className="h-px bg-gray-800" />
            <View className="bg-gray-950 p-3">
              <Text className="mb-1 text-sm text-gray-500">From</Text>
              <Text className="font-mono text-sm text-gray-200">John Doe</Text>
            </View>
            <View className="h-px bg-gray-800" />
            <View className="rounded-b-lg bg-gray-950 p-3">
              <Text className="mb-1 text-sm text-gray-500">Amount</Text>
              <Text className="font-mono text-sm text-gray-200">$100</Text>
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={onClose}
              className="flex-1 items-center rounded-lg bg-gray-950 py-3">
              <Text className="font-medium text-gray-500">Cancel</Text>
            </Pressable>
            <Pressable
              className={cn(
                'flex-1 items-center rounded-lg py-3',
                isRequest ? 'bg-receiving-secondary' : 'bg-sending-secondary'
              )}
              onPress={() => {
                // Handle the action based on type
                console.log(`${isRequest ? 'Accepting' : 'Sending'} payment with ID: ${id}`);
                onClose();
              }}>
              <Text className="font-medium text-white">{isRequest ? 'Accept' : 'Send'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
