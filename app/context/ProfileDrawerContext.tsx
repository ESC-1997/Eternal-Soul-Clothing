"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ProfileDrawerContextType {
  user: any;
  setUser: (user: any) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
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

  return (
    <ProfileDrawerContext.Provider value={{ user, setUser, drawerOpen, setDrawerOpen }}>
      {children}
    </ProfileDrawerContext.Provider>
  );
} 