"use client";
import { api } from "~/trpc/react";
import { React, useEffect } from "react";

export default function useDailySongPrefetch() {
  const utils = api.useContext();

  useEffect(() => {
    utils.spotify.getDailySong.prefetch();
  }, [utils.spotify.getDailySong]);
}

export function DailySongPrefetchWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useDailySongPrefetch();
  return <>{children}</>;
}
