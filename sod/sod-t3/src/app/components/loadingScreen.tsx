// components/LoadingScreen.tsx
"use client";
import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-black">
      <div className="relative h-48 w-48">
        {/* Vinyl record */}
        <div className="h-full w-full animate-pulse rounded-full border-8 border-gray-800 bg-black">
          <div className="absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gray-800">
            <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white"></div>
          </div>
        </div>
        {/* Record player arm */}
        <div className="absolute left-1/2 top-1/2 h-1 w-1/2 origin-left -translate-y-1/2 animate-spin-slow bg-gray-300"></div>
      </div>
      <p className="mt-8 animate-pulse text-2xl font-bold text-white">
        Loading your music...
      </p>
    </div>
  );
};

export default LoadingScreen;
