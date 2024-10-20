import { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import HistoryContent from "../components/HistoryContent";
import LoadingScreen from "../components/loadingScreen";
import AccessDenied from "../components/AccessDenied";

export const revalidate = 60; // Revalidate this page every 60 seconds

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <AccessDenied></AccessDenied>;
  }

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="mb-8 text-3xl font-bold">Play History</h1>
      <Suspense fallback={<LoadingScreen />}>
        <HistoryContent />
      </Suspense>
    </div>
  );
}
