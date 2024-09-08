"use client"; //todo this could be server-side, call on getUserProfile
import React from 'react';
import { useHandleUnauthorized } from "../_trpc/Provider";
import { FaUser, FaEnvelope, FaSpotify, FaUsers, FaGlobe, FaLink } from "react-icons/fa";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from '~/components/ui/badge';
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

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

  if (isLoading) return <ProfileSkeleton />;

  if (error) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg font-medium text-red-500">Error loading profile</div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600">
        <img
          src={userProfile.images?.[0]?.url || "https://via.placeholder.com/150"}
          alt="Profile"
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-32 h-32 rounded-full border-4 border-white object-cover"
        />
      </div>
      <div className="pt-16 pb-8 px-6 text-center">
        <h3 className="text-2xl font-bold text-gray-800">
          {userProfile.display_name || "User Name Unavailable"}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{userProfile.id || "N/A"}</p>
        <div className="mt-4 flex justify-center space-x-2">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <FaUsers className="text-gray-400" />
            <span>{userProfile.followers?.total.toLocaleString() || "0"} followers</span>
          </Badge>
          {userProfile.product && (
            <Badge variant="outline" className="flex items-center space-x-1">
              <FaSpotify className="text-green-500" />
              <span>{userProfile.product}</span>
            </Badge>
          )}
        </div>
        <div className="mt-6 space-y-2">
          <InfoItem icon={<FaEnvelope />} text={userProfile.email || "Email Unavailable"} />
          {userProfile.country && <InfoItem icon={<FaGlobe />} text={userProfile.country} />}
        </div>
        {userProfile.external_urls?.spotify && (
          <Button variant="outline" className="mt-6" onClick={() => window.open(userProfile.external_urls.spotify, '_blank')}>
            <FaSpotify className="mr-2" /> View on Spotify
          </Button>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ icon, text }) => (
  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
    {icon}
    <span>{text}</span>
  </div>
);

const ProfileSkeleton = () => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="h-40 bg-gray-200" />
    <div className="pt-16 pb-8 px-6">
      <Skeleton className="h-32 w-32 rounded-full mx-auto -mt-24 mb-4" />
      <Skeleton className="h-8 w-48 mx-auto mb-2" />
      <Skeleton className="h-4 w-32 mx-auto mb-4" />
      <div className="flex justify-center space-x-2 mb-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-48 mx-auto" />
        <Skeleton className="h-4 w-40 mx-auto" />
      </div>
    </div>
  </div>
);

export default UserProfile;