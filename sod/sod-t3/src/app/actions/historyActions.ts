"use server";
import { db as prisma } from "~/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function getStoredHistory(userId: string): Promise<any> {
  let history = []
  try {
    // Fetch the existing game state for today
    history = await prisma.History.findFirst({
      where: {
        userId,
      },
    });
  } catch (error) {
    console.error("Detailed error in getStoredHistory:", JSON.stringify(error, null, 2));
    throw error;
  }
  return history;
}
