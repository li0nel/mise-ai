import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "@/lib/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { isFirebaseError } from "../../types/auth";

const RESEND_COOLDOWN_SECONDS = 30;

export default function VerifyEmailScreen() {
  const { user, isVerified, reloadUser, resendVerification, signOut } =
    useAuth();
  const router = useRouter();

  const [isCheckPending, setIsCheckPending] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  // Redirect to main app once verified
  useEffect(() => {
    if (isVerified) {
      router.replace("/(main)");
    }
  }, [isVerified, router]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => {
      setResendCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const handleCheckVerification = async () => {
    setCheckError(null);
    setIsCheckPending(true);
    try {
      await reloadUser();
      // Check source of truth directly — context `isVerified` updates
      // asynchronously, but auth.currentUser is already reloaded.
      if (!auth.currentUser?.emailVerified) {
        setCheckError(
          "Your email hasn\u2019t been verified yet. Please check your inbox.",
        );
      }
      // If verified, the useEffect on isVerified will redirect.
    } catch {
      setCheckError("Could not check verification status. Please try again.");
    } finally {
      setIsCheckPending(false);
    }
  };

  const handleResend = async () => {
    setResendError(null);
    setResendSuccess(false);
    try {
      await resendVerification();
      setResendSuccess(true);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (e: unknown) {
      const code = isFirebaseError(e) ? e.code : "";
      if (code === "auth/too-many-requests") {
        setResendError("Too many attempts. Please wait before resending.");
      } else {
        setResendError("Failed to resend. Please try again.");
      }
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
      </View>

      {/* Info card */}
      <View className="bg-bg-surface border-[1.5px] border-border rounded-md p-5 mb-6">
        <Text className="text-base font-semibold text-text mb-2">
          Verify your email
        </Text>
        <Text className="text-sm text-text-2 leading-relaxed">
          We sent a verification link to{" "}
          <Text className="font-semibold text-text">
            {user?.email ?? "your email"}
          </Text>
          . Open it to activate your account.
        </Text>
      </View>

      {/* Primary CTA: check verification */}
      <Pressable
        onPress={handleCheckVerification}
        disabled={isCheckPending}
        className={`w-full h-[50px] bg-brand rounded-md items-center justify-center mb-3 ${isCheckPending ? "opacity-60" : ""}`}
      >
        {isCheckPending ? (
          <ActivityIndicator color="#FAFAF8" />
        ) : (
          <Text className="text-base font-bold text-text-inv tracking-tight">
            I&apos;ve verified my email
          </Text>
        )}
      </Pressable>

      {checkError && (
        <Text className="text-red-500 text-sm mb-3 text-center">
          {checkError}
        </Text>
      )}

      {/* Resend button */}
      <Pressable
        onPress={handleResend}
        disabled={resendCooldown > 0}
        className={`w-full h-[50px] bg-bg-surface border-[1.5px] border-border rounded-md items-center justify-center mb-1 ${resendCooldown > 0 ? "opacity-50" : ""}`}
      >
        <Text
          className={`text-base font-semibold tracking-tight ${resendCooldown > 0 ? "text-text-3" : "text-text"}`}
        >
          {resendCooldown > 0
            ? `Resend in ${String(resendCooldown)}s`
            : "Resend verification email"}
        </Text>
      </Pressable>

      {resendSuccess && (
        <Text className="text-success text-sm mt-1 text-center">
          Verification email sent.
        </Text>
      )}
      {resendError && (
        <Text className="text-red-500 text-sm mt-1 text-center">
          {resendError}
        </Text>
      )}

      {/* Sign out footer */}
      <View className="mt-8 items-center">
        <Pressable onPress={signOut}>
          <Text className="text-sm text-text-3">
            Wrong account?{" "}
            <Text className="text-brand font-semibold">Sign out</Text>
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
