import { Metadata } from "next";

interface DashboardLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Spotify Dashboard",
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  children,
}) => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-12 text-center text-4xl font-bold text-gray-800">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
