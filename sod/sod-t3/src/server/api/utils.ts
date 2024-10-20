import { appRouter } from "~/server/api/root";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";

export function createServerSideApi() {
  return createServerSideHelpers({
    router: appRouter,
    ctx: {}, // You might need to provide a context here, depending on your setup
    transformer: superjson,
  });
}
