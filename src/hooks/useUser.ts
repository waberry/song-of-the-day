import { useEffect, useState } from 'react';
import { SHA256 } from "crypto-js";
import UAParser from "ua-parser-js";
import { api  } from '~/trpc/react';


function generateFingerprint() {
  if (typeof window === "undefined") {
    throw new Error("This function can only be used in the browser");
  }

  const parser = new UAParser();
  const result = parser.getResult();
  
  const fingerprintData = {
    userAgent: result.ua,
    browser: result.browser.name || 'unknown',
    browserVersion: result.browser.version || 'unknown',
    os: result.os.name || 'unknown',
    osVersion: result.os.version || 'unknown',
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  const fingerprintString = JSON.stringify(fingerprintData);
  return {
    ...fingerprintData,
    fingerprint: SHA256(fingerprintString).toString(),
  };
}

export function useUser() {
  const [anonymousUserId, setAnonymousUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const identify = api.player.identify.useMutation();

  useEffect(() => {
    async function identifyUser() {
      try {
        // Check localStorage first
        const storedId = localStorage.getItem("anonymousUserId");
        if (storedId) {
          setAnonymousUserId(storedId);
          setIsLoading(false);
          return;
        }

        // Generate new fingerprint and identify user
        const fingerprint = generateFingerprint();
        const result = await identify.mutateAsync(fingerprint);
        
        localStorage.setItem("anonymousUserId", result.anonymousUserId);
        setAnonymousUserId(result.anonymousUserId);
      } catch (error) {
        console.error('Failed to identify user:', error);
      } finally {
        setIsLoading(false);
      }
    }

    identifyUser();
  }, []);

  return {
    anonymousUserId,
    isLoading,
    isNewUser: identify.data?.isNewUser,
  };
}