"use client";

import { signIn } from "next-auth/react";
import { Music } from "lucide-react";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-black">
      <div className="max-w-md w-full space-y-8 p-8 bg-white/10 backdrop-blur-lg rounded-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">
            Connect with Spotify
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Sign in to access your playlists and start playing
          </p>
        </div>
        <div className="mt-8">
          <button
            onClick={() => signIn("spotify", { callbackUrl: "/main" })}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#1DB954] hover:bg-[#1ed760] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DB954] transition-colors duration-200"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <Music className="h-5 w-5 text-[#1DB954] group-hover:text-[#1ed760]" aria-hidden="true" />
            </span>
            Continue with Spotify
          </button>
        </div>
      </div>
    </div>
  );
} 