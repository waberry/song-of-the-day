"use client";
import React from "react";

const AccessDenied: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="rounded-lg bg-white p-8 text-center shadow-2xl">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">Access Denied</h1>
        <p className="text-gray-600">
          Please sign in to view your Spotify dashboard.
        </p>
      </div>
    </div>
  );
};

export default AccessDenied;
