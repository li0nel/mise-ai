import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(main)" />;
}
