import { SHA256 } from "crypto-js";
import UAParser from "ua-parser-js";
import type { UserIdentification } from '~/server/services/userIdentification';

export function generateFingerprint(): UserIdentification {
  if (typeof window === "undefined") {
    throw new Error("This function can only be used in the browser");
  }

  const parser = new UAParser();
  const result = parser.getResult();
  
  const identification = {
    userAgent: result.ua,
    browser: result.browser.name || 'unknown',
    browserVersion: result.browser.version || 'unknown',
    os: result.os.name || 'unknown',
    osVersion: result.os.version || 'unknown',
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  // Generate fingerprint hash
  const fingerprintString = JSON.stringify(identification);
  const fingerprint = SHA256(fingerprintString).toString();

  return {
    ...identification,
    fingerprint,
  };
}

export function getStoredAnonymousUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("anonymousUserId");
}

export function setStoredAnonymousUserId(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("anonymousUserId", userId);
}
