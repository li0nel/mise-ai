import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
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
import type { Unsubscribe } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { isFirebaseError, type AuthContextType } from "@/types/auth";
import { subscribeToRecipes, addRecipe } from "@/lib/firebase/recipes";
import { useRecipeStore } from "@/lib/stores/recipeStore";
import { SEED_RECIPE } from "@/data/seedRecipe";

const isMockAI = process.env.EXPO_PUBLIC_MOCK_AI === "true";

const MOCK_USER = { emailVerified: true, uid: "mock-user" } as User;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(isMockAI ? MOCK_USER : null);
  const [isLoading, setIsLoading] = useState(!isMockAI);

  const recipeUnsubRef = useRef<Unsubscribe | null>(null);
  const seededRef = useRef(false);

  useEffect(() => {
    if (isMockAI) return;
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  // Subscribe to Firestore recipes when user is signed in
  useEffect(() => {
    if (!user) {
      // Signed out — unsubscribe and clear
      recipeUnsubRef.current?.();
      recipeUnsubRef.current = null;
      useRecipeStore.getState().setRecipes([]);
      seededRef.current = false;
      return;
    }

    // In mock AI mode, seed the store directly (no Firestore)
    if (isMockAI) {
      useRecipeStore
        .getState()
        .setRecipes([{ ...SEED_RECIPE, id: SEED_RECIPE.id }]);
      return;
    }

    let isFirst = true;
    recipeUnsubRef.current = subscribeToRecipes(user.uid, (recipes) => {
      useRecipeStore.getState().setRecipes(recipes);

      // Seed Massaman Curry on first login when collection is empty
      if (isFirst && recipes.length === 0 && !seededRef.current) {
        seededRef.current = true;
        addRecipe(user.uid, SEED_RECIPE).catch(() => {
          // Seed write failed — not critical
        });
      }
      isFirst = false;
    });

    return () => {
      recipeUnsubRef.current?.();
      recipeUnsubRef.current = null;
    };
  }, [user]);

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
