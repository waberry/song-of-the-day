import { getServerSession } from "next-auth/next";
import Navbar from "./navbar";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function NavbarWrapper() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <Navbar session={session} />
    </>
  );
}
