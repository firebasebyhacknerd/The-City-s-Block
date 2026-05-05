'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'buyer' | 'owner' | 'agent' | 'admin';
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'banned';
  phone?: string;
  city?: string;
  createdAt: string;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { auth, firestore } = initializeFirebase();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const userDocRef = doc(firestore, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            setProfile({ uid: firebaseUser.uid, ...(userSnap.data() as Omit<UserProfile, 'uid'>) });
          } else {
            setProfile(null);
          }
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    const { auth } = initializeFirebase();
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  const value = useMemo(
    () => ({ user, profile, loading, signOut }),
    [user, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  return useContext(AuthContext);
}
