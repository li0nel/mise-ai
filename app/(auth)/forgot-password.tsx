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
import { isFirebaseError } from "../../types/auth";

export default function ForgotPasswordScreen() {
  const { sendPasswordReset } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsPending(true);
    try {
      await sendPasswordReset(email.trim());
      setSubmitted(true);
    } catch (e: unknown) {
      const code = isFirebaseError(e) ? e.code : "";
      if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else if (code === "auth/user-not-found") {
        // Don't reveal whether email exists — show success either way
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
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
          Reset your password
        </Text>
      </View>

      {submitted ? (
        <View className="bg-bg-surface border-[1.5px] border-border rounded-md p-5 mb-6">
          <Text className="text-base font-semibold text-text mb-2">
            Check your inbox
          </Text>
          <Text className="text-sm text-text-2 leading-relaxed">
            If an account exists for{" "}
            <Text className="font-semibold text-text">{email}</Text>, you will
            receive a password reset link shortly.
          </Text>
        </View>
      ) : (
        <>
          <Text className="text-sm text-text-2 mb-5 leading-relaxed">
            Enter the email address for your account and we&apos;ll send you a
            reset link.
          </Text>

          {/* Email field */}
          <View className="mb-5">
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

          {/* Send reset link button */}
          <Pressable
            onPress={handleSubmit}
            disabled={isPending}
            className={`w-full h-[50px] bg-brand rounded-md items-center justify-center mb-1 ${isPending ? "opacity-60" : ""}`}
          >
            {isPending ? (
              <ActivityIndicator color="#FAFAF8" />
            ) : (
              <Text className="text-base font-bold text-text-inv tracking-tight">
                Send reset link
              </Text>
            )}
          </Pressable>

          {/* Error message */}
          {error && (
            <Text className="text-red-500 text-sm mt-2 text-center">
              {error}
            </Text>
          )}
        </>
      )}

      {/* Back to sign in */}
      <View className="mt-8 items-center">
        <Pressable onPress={() => router.push("/(auth)/login")}>
          <Text className="text-sm text-brand font-semibold">
            Back to sign in
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
