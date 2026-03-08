import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
  const { user, isLoading, isVerified } = useAuth();

  if (isLoading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;
  if (!isVerified) return <Redirect href="/(auth)/verify-email" />;
  return <Redirect href="/(main)" />;
}
