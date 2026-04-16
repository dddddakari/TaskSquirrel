/**
 * auth-context.tsx — Authentication context for TaskSquirrel
 *
 * Provides `user`, `loading`, `signIn`, `signUp`, and `signOut` to the
 * entire component tree via React Context. Wraps Firebase Auth's
 * onAuthStateChanged listener so every screen can access auth state.
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth } from "./firebase";

/** Shape of the value provided by AuthContext */
type AuthContextType = {
  user: User | null;       // Current Firebase user (null = not signed in)
  loading: boolean;        // True while checking initial auth state
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

/** Hook to access auth state from any component */
export const useAuth = () => useContext(AuthContext);

/** Wrap the app root with this provider to enable auth everywhere */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes (login, logout, token refresh)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sign in with email + password
  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Create a new account with email + password
  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign out the current user
  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
