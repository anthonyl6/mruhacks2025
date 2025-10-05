import { Fragment, useState } from 'react';
import {
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabGroup } from './TabGroup';
import { ArrowBigRightDash } from 'lucide-react-native';
import { HorizontalSideScroll } from './slide'; // Adjust path if needed
import { cn } from 'lib/util';
import { useAuth } from 'providers/auth-provider';
import SendAndRequestModal from './SendAndRequestModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Sample user data
const users = [
  { email: 'alice@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
  { email: 'bob@example.com', avatar: 'https://i.pravatar.cc/150?img=2' },
  { email: 'brady@example.com', avatar: 'https://i.pravatar.cc/150?img=3' },
  { email: 'herc@example.com', avatar: 'https://i.pravatar.cc/150?img=4' },
  { email: 'davo@example.com', avatar: 'https://i.pravatar.cc/150?img=5' },
  { email: 'serana@example.com', avatar: 'https://i.pravatar.cc/150?img=6' },
  { email: 'cheese@example.com', avatar: 'https://i.pravatar.cc/150?img=7' },
  { email: 'justcats@example.com', avatar: 'https://i.pravatar.cc/150?img=8' },
];

const transactions = [
  {
    currency: 'CAD',
    amount: -10050,
    date: '2025-01-01',
    description: 'Payment to Alice',
    from: 'alice1@example.com',
  },
  {
    currency: 'USD',
    amount: 20020,
    date: '2025-01-02',
    description: 'Received from Bob',
    from: 'bob1@example.com',
  },
  {
    currency: 'EUR',
    amount: -30056,
    date: '2025-01-03',
    description: 'Payment to Brady',
    from: 'brady1@example.com',
  },
  {
    currency: 'GBP',
    amount: 40050,
    date: '2025-01-04',
    description: 'Received from Herc',
    from: 'herc1@example.com',
  },
  {
    currency: 'AUD',
    amount: -50000,
    date: '2025-01-05',
    description: 'Payment to Davo',
    from: 'davo1@example.com',
  },
  {
    currency: 'CAD',
    amount: -10050,
    date: '2025-01-01',
    description: 'Payment to Alice',
    from: 'alice2@example.com',
  },
  {
    currency: 'USD',
    amount: 20020,
    date: '2025-01-02',
    description: 'Received from Bob',
    from: 'bob2@example.com',
  },
  {
    currency: 'EUR',
    amount: -30056,
    date: '2025-01-03',
    description: 'Payment to Brady',
    from: 'brady2@example.com',
  },
  {
    currency: 'GBP',
    amount: 40050,
    date: '2025-01-04',
    description: 'Received from Herc',
    from: 'herc2@example.com',
  },
  {
    currency: 'AUD',
    amount: -50000,
    date: '2025-01-05',
    description: 'Payment to Davo',
    from: 'davo2@example.com',
  },
];

export const ScreenContent = () => {
  const isAndroid15 = Platform.OS === 'android' && Platform.Version >= 35;
  const [selectedTab, setSelectedTab] = useState<'send' | 'request'>('send');
  const [emailInput, setEmailInput] = useState(''); // New state for controlled input
  const [sendAndRequestModalDetails, setSendAndRequestModalDetails] = useState<
    | {
        name?: string;
        email?: string;
      }
    | undefined
  >(undefined);
  const { user } = useAuth();
  const tabs = [
    { label: 'Send', value: 'send' as const, selectedColor: '#db8a74' },
    { label: 'Request', value: 'request' as const, selectedColor: '#9b96b0' },
  ];
  const WrapperComponent = isAndroid15 ? View : SafeAreaView;

  return (
    <View className="bg-background flex flex-1 items-center justify-center">
      <WrapperComponent className="flex w-screen flex-1 flex-col items-start justify-start pt-16">
        {sendAndRequestModalDetails?.email && (
          <SendAndRequestModal
            onClose={() => setSendAndRequestModalDetails(undefined)}
            otherPartyDetails={sendAndRequestModalDetails}
            type={selectedTab}
          />
        )}
        <View className="flex w-full flex-1 flex-col items-center justify-start">
          <Text className="text-foreground mt-8 text-3xl">Welcome, {user?.fname}!</Text>
          <TabGroup selectedTab={selectedTab} onSelect={setSelectedTab} tabs={tabs} />

          {/* Email Input + Copy Button */}
          <View className="mx-12 flex flex-row items-center justify-center gap-2">
            <TextInput
              value={emailInput} // Bind to state
              onChangeText={setEmailInput} // Allow manual edits
              inputMode="email"
              className="placeholder:text-foreground/50 text-foreground flex-1 overflow-hidden rounded-full bg-[#212121] p-6 px-6"
              placeholder="email@example.com"
            />
            <Pressable
              className="items-center justify-center overflow-hidden rounded-full bg-[#212121] p-5 transition-all duration-300 active:bg-[#3f3f3f]"
              onPress={() => setSendAndRequestModalDetails({ name: 'Unknown', email: emailInput })}>
              <ArrowBigRightDash size={20} color="#ffffff" strokeWidth={2} />
            </Pressable>
          </View>

          {/* Horizontal Profile Carousel */}
          <View className="mt-6 w-full items-center">
            <Text className="mb-2 w-full px-12 text-xl text-gray-300">Recents</Text>
            <HorizontalSideScroll>
              {users.map((user, index) => {
                const truncatedEmail =
                  user.email.length > 8 ? user.email.split('@')[0] : user.email;

                return (
                  <View
                    key={user.email}
                    className={cn(
                      'mx-4 items-center bg-transparent py-4',
                      index === 0 && 'ml-10',
                      index === users.length - 1 && 'mr-10'
                    )}>
                    {/* Make avatar clickable to set email in input */}
                    <Pressable
                      onPress={() =>
                        setSendAndRequestModalDetails({ name: truncatedEmail, email: user.email })
                      }>
                      <Image
                        source={{ uri: user.avatar }}
                        className="mb-2 h-25 w-25 rounded-full border-2 border-white"
                      />
                    </Pressable>
                    <Text className="text-base text-gray-300" numberOfLines={1}>
                      {truncatedEmail}
                    </Text>
                  </View>
                );
              })}
            </HorizontalSideScroll>
          </View>
          <View className="mb-12 w-screen flex-1">
            <ScrollView>
              {transactions.map((transaction, index) => (
                <Fragment key={transaction.from}>
                  {index !== 0 && <View className="mx-6 h-px w-[calc(100%-3rem)] bg-gray-800" />}
                  <View className={cn('flex w-full flex-row p-6')}>
                    <View className="flex-1">
                      <Text className="text-base text-gray-500/50">{transaction.from}</Text>
                      <Text
                        className={cn(
                          'text-xl',
                          transaction.amount > 0 ? 'text-receiving' : 'text-sending'
                        )}>
                        {transaction.currency} ${(Math.abs(transaction.amount) / 100).toFixed(2)}
                      </Text>
                    </View>
                    <View className="">
                      <Text className="text-right text-sm text-gray-500/50">
                        {transaction.date}
                      </Text>
                      <Text className="text-right text-sm text-gray-500/50">
                        {transaction.description}
                      </Text>
                    </View>
                  </View>
                </Fragment>
              ))}
            </ScrollView>
          </View>
        </View>
      </WrapperComponent>
    </View>
  );
};
