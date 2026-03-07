import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerClassName="px-7 pb-12 pt-8"
      keyboardShouldPersistTaps="handled"
    >
      {/* Brand identity */}
      <View className="items-center mb-9 mt-2">
        <Text className="text-[38px] font-extrabold tracking-tighter text-text leading-none">
          mise<Text className="text-brand">.</Text>
        </Text>
        <Text className="text-sm text-text-3 mt-1.5 tracking-wide">
          Your AI cooking companion
        </Text>
      </View>

      {/* Email field */}
      <View className="mb-3">
        <Text className="text-xs font-semibold text-text-2 uppercase tracking-wider mb-1.5">
          Email
        </Text>
        <TextInput
          className="w-full h-12 bg-bg-surface border-[1.5px] border-border rounded-md px-4 text-base text-text"
          placeholder="you@example.com"
          placeholderTextColor="#C4BCB5"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password field */}
      <View className="mb-3">
        <Text className="text-xs font-semibold text-text-2 uppercase tracking-wider mb-1.5">
          Password
        </Text>
        <TextInput
          className="w-full h-12 bg-bg-surface border-[1.5px] border-border rounded-md px-4 text-base text-text"
          placeholder="••••••••"
          placeholderTextColor="#C4BCB5"
          secureTextEntry
          autoComplete="current-password"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Forgot password */}
      <Pressable className="self-end mb-4 -mt-1">
        <Text className="text-xs font-medium text-brand">
          Forgot password?
        </Text>
      </Pressable>

      {/* Sign in button */}
      <Pressable
        onPress={login}
        className="w-full h-[50px] bg-brand rounded-md items-center justify-center mb-1"
      >
        <Text className="text-base font-bold text-text-inv tracking-tight">
          Sign in
        </Text>
      </Pressable>

      {/* Divider */}
      <View className="flex-row items-center my-5 gap-3">
        <View className="flex-1 h-px bg-border-subtle" />
        <Text className="text-xs font-medium text-text-3 tracking-wider">
          or
        </Text>
        <View className="flex-1 h-px bg-border-subtle" />
      </View>

      {/* OAuth buttons */}
      <View className="gap-2.5">
        {/* Google */}
        <Pressable
          onPress={login}
          className="w-full h-12 flex-row items-center justify-center gap-2.5 bg-bg-surface border-[1.5px] border-border rounded-md"
        >
          <Text className="text-base font-semibold text-text">G</Text>
          <Text className="text-base font-semibold text-text tracking-tight">
            Continue with Google
          </Text>
        </Pressable>

        {/* Apple */}
        <Pressable
          onPress={login}
          className="w-full h-12 flex-row items-center justify-center gap-2.5 bg-bg-surface border-[1.5px] border-border rounded-md"
        >
          <Text className="text-base font-semibold text-text">{"\uF8FF"}</Text>
          <Text className="text-base font-semibold text-text tracking-tight">
            Continue with Apple
          </Text>
        </Pressable>
      </View>

      {/* Sign up footer */}
      <View className="mt-8 items-center">
        <Text className="text-sm text-text-3">
          Don&apos;t have an account?{" "}
          <Text className="text-brand font-semibold">Sign up</Text>
        </Text>
      </View>
    </ScrollView>
  );
}
