// components/UserProfile.tsx
"use client";
import { api } from "~/trpc/react";
import { useHandleUnauthorized } from "../_trpc/Provider";
import { FaUser, FaEnvelope, FaSpotify, FaUsers } from "react-icons/fa";

const UserProfile = () => {
  // const handleUnauthorized = useHandleUnauthorized();
  const {
    data: userProfile,
    isLoading,
    error,
  } = api.spotify.getUserProfile.useQuery(undefined, {
    ...useHandleUnauthorized,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div>Error loading profile</div>;

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <div className="text-center">
        <img
          src={
            userProfile.images?.[0]?.url || "https://via.placeholder.com/150"
          }
          alt="Profile"
          className="mx-auto mb-4 h-32 w-32 rounded-full"
        />
        <h3 className="mb-2 text-2xl font-semibold">
          {userProfile.display_name || "N/A"}
        </h3>
        <p className="mb-4 text-gray-600">{userProfile.id || "N/A"}</p>
        <div className="flex justify-center space-x-4">
          <div>
            <FaEnvelope className="mx-auto text-gray-400" />
            <p className="mt-1 text-sm">{userProfile.email || "N/A"}</p>
          </div>
          <div>
            <FaUsers className="mx-auto text-gray-400" />
            <p className="mt-1 text-sm">
              {userProfile.followers?.total || 0} followers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
