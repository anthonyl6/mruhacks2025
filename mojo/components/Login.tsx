import { ArrowRightIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useAuth } from 'providers/auth-provider';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  return (
    <View className="fixed top-0 left-0 h-screen w-screen flex-1 items-center justify-center gap-4">
      <View>
        <Text className="text-foreground mb-8 text-2xl font-bold">Log in to your MoJo account</Text>
      </View>
      <View className="flex w-[80%] flex-row items-center gap-2">
        <TextInput
          className="bg-background flex-1 rounded-full p-4 text-foreground"
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View className="flex w-[80%] flex-row items-center gap-2">
        <TextInput
          className="bg-background flex-1 rounded-full p-4 text-foreground"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <Pressable
          className="bg-background rounded-full p-4"
          onPress={() => login(username, password)}>
          <ArrowRightIcon color="white" size={20} strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
}
