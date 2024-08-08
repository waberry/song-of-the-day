"use client";
import { api } from "~/trpc/react";

export default function useDailySongPrefetch() {
  const utils = api.useContext();
  utils.spotify.getDailySong.prefetch();
}

export function DailySongPrefetchWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useDailySongPrefetch();
  return <>{children}</>;
}
