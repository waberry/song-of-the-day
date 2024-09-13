"use client";
import { api } from "~/trpc/react";
import { useEffect } from "react";


// Optionally, if you want to create a more generic prefetch utility:
export function usePrefetch<
  TProcedure extends keyof typeof api.spotify,
  TInput extends Parameters<(typeof api.spotify)[TProcedure]["useQuery"]>[0]
>(procedure: TProcedure, input?: TInput) {
  const utils = api.useContext();

  useEffect(() => {
    if (procedure in utils.spotify) {
      (utils.spotify[procedure] as any).prefetch(input, {
        trpc: { context: { skipLogging: true } }
      });
    }
  }, [utils.spotify, procedure, input]);
}

//Usage
// usePrefetch('procedureName', { /* input if needed */ });


export default function useDailySongPrefetch() {
  const utils = api.useContext();

  useEffect(() => {
    utils.spotify.getDailySong.prefetch(undefined, {
      trpc: { context: { skipLogging: true } }
    });
  }, [utils.spotify.getDailySong]);
}

export function DailySongPrefetchWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // useDailySongPrefetch();
  // usePrefetch('procedureName', { /* input if needed */ });
  return <>{children}</>;
}

