import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "~/server/api/root";
export const trpc = createTRPCReact<AppRouter>();
