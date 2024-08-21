// components/UserProfile.tsx
"use client";
import { api } from "~/trpc/react";
import { useHandleUnauthorized } from "../_trpc/Provider";
import { FaUser, FaEnvelope, FaSpotify, FaUsers } from "react-icons/fa";

const UserProfile = () => {
  const {
    data: userProfile,
    isLoading,
    error,
  } = api.spotify.getUserProfile.useQuery(undefined, {
    ...useHandleUnauthorized,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg font-medium">Loading profile...</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg font-medium text-red-500">Error loading profile</div>
    </div>
  );

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg bg-gradient-to-b from-sky-400 to-indigo-800 text-indigo-900 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
      <div className="text-center">
        <img
          src={userProfile.images?.[0]?.url || "https://via.placeholder.com/150"}
          alt="Profile"
          className="mx-auto mb-4 h-32 w-32 rounded-full object-cover shadow-sm"
        />
        <h3 className="mb-2 text-2xl font-semibold">
          {userProfile.display_name || "User Name Unavailable"}
        </h3>
        <p className="text-white-600">{userProfile.id || "N/A"}</p>
        <div className="flex justify-center space-x-4 mt-4">
          <div>
            <FaEnvelope className="mx-auto text-gray-400 text-lg" />
            <p className="mt-1 text-sm">{userProfile.email || "Email Unavailable"}</p>
          </div>
          <div>
            <FaUsers className="mx-auto text-gray-400 text-lg" />
            <p className="mt-1 text-sm">
              {userProfile.followers?.total.toLocaleString() || "0"} followers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
