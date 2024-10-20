// File: /app/_trpc/Provider.tsx

"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { api } from "~/trpc/react";
import { signOut, getSession } from "next-auth/react";
import { TRPCClientError } from "@trpc/client";
import superjson from "superjson";

export const useHandleUnauthorized = () => {
  return {
    onError: (error: unknown) => {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "UNAUTHORIZED"
      ) {
        console.error("Unauthorized access, signing out");
        signOut();
      }
    },
  };
};

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" &&
            typeof window !== "undefined" &&
            opts.direction === "down" &&
            opts.result instanceof Error,
        }),
        httpBatchLink({
          url: "/api/trpc",
          async headers() {
            const session = await getSession();
            if (session) {
              return {
                authorization: `Bearer ${session.accessToken}`,
                "x-refresh-token": session.refreshToken as string,
              };
            }
            return {};
          },
        }),
      ],
      transformer: superjson,
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}