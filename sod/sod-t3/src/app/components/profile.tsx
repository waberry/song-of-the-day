"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (status === "authenticated" && session.accessToken) {
      fetchUserProfile(session.accessToken);
    }
  }, [session, status]);

  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Access Denied</div>;
  }

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      {userProfile ? (
        <div>
          <p>Welcome, {userProfile.display_name}!</p>
          <p>Email: {userProfile.email}</p>
          <p>Spotify URI: {userProfile.uri}</p>
          <p>Followers: {userProfile.followers.total}</p>
          {userProfile.images && userProfile.images[0] && (
            <img
              src={userProfile.images[0].url}
              alt="Profile"
              className="mt-4 h-20 w-20 rounded-full"
            />
          )}
        </div>
      ) : (
        <p>Loading user profile...</p>
      )}
    </div>
  );
}
