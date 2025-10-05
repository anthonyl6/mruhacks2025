import { ArrowRightIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useAuth } from 'providers/auth-provider';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const { login, register } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (showRegister) {
    return (
      <View className="fixed top-0 left-0 h-screen w-screen flex-1 items-center justify-center gap-4">
        <View>
          <Text className="text-foreground mb-8 text-2xl font-bold">
            Register for a MoJo account
          </Text>
        </View>
        <View className="flex w-[80%] flex-row items-center gap-2">
          <TextInput
            className="bg-background text-foreground flex-1 rounded-full p-4"
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View className="flex w-[80%] flex-row items-center gap-2">
          <TextInput
            className="bg-background text-foreground flex-1 rounded-full p-4"
            placeholder="First Name"
            value={fname}
            onChangeText={setFname}
          />
        </View>
        <View className="flex w-[80%] flex-row items-center gap-2">
          <TextInput
            className="bg-background text-foreground flex-1 rounded-full p-4"
            placeholder="Last Name"
            value={lname}
            onChangeText={setLname}
          />
        </View>
        <View className="flex w-[80%] flex-row items-center gap-2">
          <TextInput
            className="bg-background text-foreground flex-1 rounded-full p-4"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View className="flex w-[80%] flex-row items-center gap-2">
          <TextInput
            className="bg-background text-foreground flex-1 rounded-full p-4"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          <Pressable
            className="bg-background rounded-full p-4"
            onPress={() => register(username, password, fname, lname, email)}>
            <ArrowRightIcon color="white" size={20} strokeWidth={2} />
          </Pressable>
        </View>
        <Pressable onPress={() => setShowRegister(false)}>
          <Text className="text-blue-500 underline">Already have an account? Log in!</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View className="fixed top-0 left-0 h-screen w-screen flex-1 items-center justify-center gap-4">
      <View>
        <Text className="text-foreground mb-8 text-2xl font-bold">Log in to your MoJo account</Text>
      </View>
      <View className="flex w-[80%] flex-row items-center gap-2">
        <TextInput
          className="bg-background text-foreground flex-1 rounded-full p-4"
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View className="flex w-[80%] flex-row items-center gap-2">
        <TextInput
          className="bg-background text-foreground flex-1 rounded-full p-4"
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
      <Pressable onPress={() => setShowRegister(true)}>
        <Text className="text-blue-500 underline">New here? Register!</Text>
      </Pressable>
    </View>
  );
}
