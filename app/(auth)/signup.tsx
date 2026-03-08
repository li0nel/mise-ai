import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { EyeIcon, EyeOffIcon } from "../../components/ui/Icons";

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSignUp = async () => {
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsPending(true);
    try {
      await signUp(email, password);
      router.replace("/(auth)/verify-email");
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? "";
      if (code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Sign up failed. Please try again.");
      }
    } finally {
      setIsPending(false);
    }
  };

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
          Create your account
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
        <View className="flex-row items-center bg-bg-surface border-[1.5px] border-border rounded-md">
          <TextInput
            className="flex-1 h-12 px-4 text-base text-text"
            placeholder="At least 6 characters"
            placeholderTextColor="#C4BCB5"
            secureTextEntry={!showPassword}
            autoComplete="new-password"
            value={password}
            onChangeText={setPassword}
          />
          <Pressable
            onPress={() => setShowPassword((v) => !v)}
            className="px-3 h-12 justify-center"
          >
            {showPassword ? (
              <EyeOffIcon size={20} color="#8C857E" />
            ) : (
              <EyeIcon size={20} color="#8C857E" />
            )}
          </Pressable>
        </View>
      </View>

      {/* Confirm password field */}
      <View className="mb-5">
        <Text className="text-xs font-semibold text-text-2 uppercase tracking-wider mb-1.5">
          Confirm password
        </Text>
        <View className="flex-row items-center bg-bg-surface border-[1.5px] border-border rounded-md">
          <TextInput
            className="flex-1 h-12 px-4 text-base text-text"
            placeholder="Re-enter your password"
            placeholderTextColor="#C4BCB5"
            secureTextEntry={!showPassword}
            autoComplete="new-password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Pressable
            onPress={() => setShowPassword((v) => !v)}
            className="px-3 h-12 justify-center"
          >
            {showPassword ? (
              <EyeOffIcon size={20} color="#8C857E" />
            ) : (
              <EyeIcon size={20} color="#8C857E" />
            )}
          </Pressable>
        </View>
      </View>

      {/* Create account button */}
      <Pressable
        onPress={handleSignUp}
        disabled={isPending}
        className={`w-full h-[50px] bg-brand rounded-md items-center justify-center mb-1 ${isPending ? "opacity-60" : ""}`}
      >
        {isPending ? (
          <ActivityIndicator color="#FAFAF8" />
        ) : (
          <Text className="text-base font-bold text-text-inv tracking-tight">
            Create account
          </Text>
        )}
      </Pressable>

      {/* Error message */}
      {error && (
        <Text className="text-red-500 text-sm mt-2 text-center">{error}</Text>
      )}

      {/* Sign in footer */}
      <View className="mt-8 items-center">
        <Text className="text-sm text-text-3">
          Already have an account?{" "}
          <Text
            className="text-brand font-semibold"
            onPress={() => router.push("/(auth)/login")}
          >
            Sign in
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}
