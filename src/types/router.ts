import type { AppRouter } from "~/server/api/root";
import { inferRouterOutputs, inferRouterInputs } from "@trpc/server";

export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
