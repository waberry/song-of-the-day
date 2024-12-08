import { getServerSession } from "next-auth/next";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";
import Navbar from "./navbar";
import { SessionProvider } from "next-auth/react";

export default async function NavbarWrapper() {
  const session = await getServerSession(authOptions);
  
  return (
    <SessionProvider session={session}>
      <Navbar />
    </SessionProvider>
  );
}
