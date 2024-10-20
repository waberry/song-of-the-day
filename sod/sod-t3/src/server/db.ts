import { PrismaClient } from "@prisma/client";
import { SHA256 } from "crypto-js";

import { env } from "~/env";

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// export const db = globalForPrisma.prisma ?? createPrismaClient();
export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

// Function to retrieve userId from the database based on fingerPrintStringHash
export async function getUserIdFromDB(fingerPrintStringhash: string): Promise<string | null> {
  try {
    // const fingerPrintStringhash = SHA256(fingerPrintString).toString();

    const user = await db.user.findUnique({
      where: { fingerPrintStringhash }, // Assuming you have a column named deviceInfoHash
      select: { id: true },       // Only select the user ID
    });

    return user ? user.id : null;
  } catch (error) {
    console.error("Error fetching user ID from DB:", error);
    throw new Error("Failed to retrieve user ID from the database.");
  }
}

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
