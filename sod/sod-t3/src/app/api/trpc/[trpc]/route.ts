import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { env } from "~/env.mjs";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";


export const config = {
  api: {
    bodyParser: true, // Ensure body parser is enabled
  },
};


// Handler for GET and POST
const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req, // Pass the NextRequest
    router: appRouter, // Your tRPC router
    createContext: () => createTRPCContext({ req }), // Context function
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`);
          }
        : undefined,
  });


export { handler as GET, handler as POST };