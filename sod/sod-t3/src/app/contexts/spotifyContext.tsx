"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface SpotifyContextType {
  spotifyToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      setSpotifyToken(session.user.accessToken || null);
      setRefreshToken(session.user.refreshToken || null);
      setExpiresAt(session.user.expiresAt || null);
    }
  }, [session]);

  return (
    <SpotifyContext.Provider value={{ spotifyToken, refreshToken, expiresAt }}>
      {children}
    </SpotifyContext.Provider>
  );
}

export function useSpotify() {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error("useSpotify must be used within a SpotifyProvider");
  }
  return context;
}
