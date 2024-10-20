// hooks/usePrefetchQueries.ts
"use client";
import { useEffect } from "react";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

export default function usePrefetchQueries() {
  const { status } = useSession();
  const utils = api.useContext();

  useEffect(() => {
    if (status === "authenticated") {
      utils.spotify.getUserProfile.prefetch();
      utils.spotify.getTopTracks.prefetch();
      utils.spotify.getRecentlyPlayed.prefetch();
    }
  }, [status, utils]);
}

export function PrefetchQueriesWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  usePrefetchQueries();
  return <>{children}</>;
}
