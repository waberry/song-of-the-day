"use client";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { SpotifyProvider } from "../contexts/spotifyContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SpotifyProvider>{children}</SpotifyProvider>
    </SessionProvider>
  );
}
