import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

// User data type interface
interface UserType {
  email: string | null;
  uid: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: UserType | null;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  loading: boolean;
}

// Create auth context
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Make auth context available across the app by exporting it
export const useAuth = () => useContext(AuthContext);

// Create the auth context provider
export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  // Define the constants for the user and loading state
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Update the state depending on auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUser({
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  // Log out function to log out the user
  const logOut = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/");
  };

  // Wrap the children with the context provider
  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, logOut, loading }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
