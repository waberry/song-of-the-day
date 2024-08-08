"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/profile";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <button
        onClick={() => signIn("spotify", { callbackUrl })}
        className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
      >
        Sign in with Spotify
      </button>
    </div>
  );
}
