import type { User } from "firebase/auth";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isVerified: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  reloadUser: () => Promise<void>;
  resendVerification: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

/** Structural shape of a Firebase error (has a `code` string on an Error). */
interface FirebaseErrorLike extends Error {
  readonly code: string;
}

/** Type guard that narrows an unknown caught value to a Firebase error with a `code` property. */
export function isFirebaseError(error: unknown): error is FirebaseErrorLike {
  return (
    error instanceof Error && "code" in error && typeof error.code === "string"
  );
}
