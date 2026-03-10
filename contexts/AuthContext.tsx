import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload,
  signOut as fbSignOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { isFirebaseError, type AuthContextType } from "@/types/auth";

const isMockAI = process.env.EXPO_PUBLIC_MOCK_AI === "true";

const MOCK_USER = { emailVerified: true, uid: "mock-user" } as User;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(isMockAI ? MOCK_USER : null);
  const [isLoading, setIsLoading] = useState(!isMockAI);

  useEffect(() => {
    if (isMockAI) return;
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const isVerified = user?.emailVerified ?? false;

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    try {
      await sendEmailVerification(credential.user);
    } catch (verifyErr: unknown) {
      // Account created but verification email failed — sign out so user
      // can retry from a clean state rather than being stuck unverified.
      await fbSignOut(auth);
      if (isFirebaseError(verifyErr)) {
        throw verifyErr;
      }
      throw new Error("Failed to send verification email");
    }
  };

  const signOut = async () => {
    await fbSignOut(auth);
  };

  const reloadUser = async () => {
    if (!auth.currentUser) return;
    await reload(auth.currentUser);
    // Force new object reference so React re-renders.
    // Spread ({...u}) loses prototype methods on Firebase User class instances.
    setUser(
      Object.assign(
        Object.create(
          Object.getPrototypeOf(auth.currentUser) as object,
        ) as User,
        auth.currentUser,
      ),
    );
  };

  const resendVerification = async () => {
    if (!auth.currentUser) return;
    await sendEmailVerification(auth.currentUser);
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isVerified,
        signIn,
        signUp,
        signOut,
        reloadUser,
        resendVerification,
        sendPasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
