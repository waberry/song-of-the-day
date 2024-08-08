import { v4 as uuidv4 } from "uuid";
import UAParser from "ua-parser-js";
import { SHA256 } from "crypto-js";

function getDeviceInfo(): string {
  if (typeof window === "undefined") return ""; // For server-side rendering

  const parser = new UAParser();
  const result = parser.getResult();

  return JSON.stringify({
    browser: result.browser.name,
    browserVersion: result.browser.version,
    os: result.os.name,
    osVersion: result.os.version,
    device: result.device.vendor
      ? `${result.device.vendor} ${result.device.model}`
      : "unknown",
    screenResolution: `${window.screen.width}x${window.screen.height}`,
  });
}

export function getAnonymousUserId(): string {
  if (typeof window === "undefined") return ""; // For server-side rendering

  let userId = localStorage.getItem("anonymousUserId");

  if (!userId) {
    const deviceInfo = getDeviceInfo();
    const randomSalt = uuidv4();
    userId = SHA256(deviceInfo + randomSalt).toString();
    localStorage.setItem("anonymousUserId", userId);
  }

  return userId;
}
