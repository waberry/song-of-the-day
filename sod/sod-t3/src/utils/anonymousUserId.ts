import { v4 as uuidv4 } from "uuid";
import { SHA256 } from "crypto-js";
import UAParser from "ua-parser-js";
import { db } from "~/server/db";
import { getGameState } from "~/app/actions/gameActions";

// Separator between the hash and the salt
const SEPARATOR = "::";



// -----------------------------------------------------------------------

function getFingerprint() {
  const parser = new UAParser();
  const result = parser.getResult();
  console.log("RESULT: ----->\n", result);
  const fingerprintData = {
    userAgent: result.ua,
    browser: result.browser.name,
    browserVersion: result.browser.version,
    os: result.os.name,
    osVersion: result.os.version,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    // Additional attributes can be added here
  };

  const fingerprintString = JSON.stringify(fingerprintData);
  return SHA256(fingerprintString).toString();
}

export async function getAnonymousUserId(): Promise<string | null> {
  //TODO server side logic maybe needed
  if (typeof window === "undefined"){
    throw new Error("Error: Server Side Usage!");
  }; // For server-side rendering

  let userId = localStorage.getItem("anonymousUserId");

  //if no userId in localStorage
  if (!userId) {
    const fingerPrintString = getFingerprint();
    const fingerPrintStringHash = SHA256(fingerPrintString).toString();
    // const randomSalt = uuidv4();
    // const userId = `${hashedfingerPrintString}${SEPARATOR}${randomSalt}`
    const GameState = await getGameState(fingerPrintStringHash);
    userId = GameState && GameState.anonymousUserId === fingerPrintStringHash ? GameState.anonymousUserId  : fingerPrintStringHash ;
    localStorage.setItem("anonymousUserId", userId || "");
  }
  return userId;
}
