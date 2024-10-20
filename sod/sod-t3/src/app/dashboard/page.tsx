import DashboardLayout from "../components/DashboardLayout";
import { DashboardCard } from "../components/DashboardCard";
import dynamic from "next/dynamic";
import { FaMusic, FaChartBar, FaHistory } from "react-icons/fa";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

// Dynamically import components that need real-time data
const UserProfile = dynamic(() => import("../components/UserProfile"), {
  ssr: false,
});
const GenreBreakdown = dynamic(() => import("../components/GenreBreakdown"), {
  ssr: false,
});
const TopTracks = dynamic(() => import("../components/TopTracks"), {
  ssr: false,
});
const RecentlyPlayed = dynamic(() => import("../components/RecentlyPlayed"), {
  ssr: false,
});

// This is a Server Component
async function getDashboardConfig() {
  // fetch any static data here
  return {
    title: "Your Spotify Insights",
    // ... other static configuration
  };
}

const Dashboard = async () => {
  const dashboardConfig = await getDashboardConfig();
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <div className="rounded-lg bg-white p-8 text-center shadow-2xl">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">
            Access Denied
          </h1>
          <p className="text-gray-600">
            Please sign in to view your Spotify dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout title={dashboardConfig.title}>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <UserProfile />
        <DashboardCard
          title="Genre Breakdown"
          icon={<FaChartBar className="text-2xl text-green-500" />}
        >
          <GenreBreakdown />
        </DashboardCard>
        <DashboardCard
          title="Top Tracks"
          icon={<FaMusic className="text-indigo-600" />}
          isScrollable={true}
          maxHeight="300px"
        >
          <TopTracks />
        </DashboardCard>
        <DashboardCard
          title="Recently Played"
          icon={<FaHistory className="text-2xl text-purple-500" />}
        >
          <RecentlyPlayed />
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
