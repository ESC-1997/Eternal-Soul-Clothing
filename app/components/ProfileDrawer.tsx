"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "../supabaseClient";

interface ProfileDrawerContextType {
  user: any;
  setUser: (user: any) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  profile: any;
  setProfile: (profile: any) => void;
}

const ProfileDrawerContext = createContext<ProfileDrawerContextType | undefined>(undefined);

export function useProfileDrawer() {
  const context = useContext(ProfileDrawerContext);
  if (!context) throw new Error("useProfileDrawer must be used within a ProfileDrawerProvider");
  return context;
}

export function ProfileDrawerProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  // Restore user session and fetch profile
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data?.user) {
        setUser(data.user);
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        if (profileData) setProfile(profileData);
      }
    });
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profileData) setProfile(profileData);
      } else {
        setProfile(null);
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <ProfileDrawerContext.Provider value={{ user, setUser, drawerOpen, setDrawerOpen, profile, setProfile }}>
      {children}
    </ProfileDrawerContext.Provider>
  );
} 
