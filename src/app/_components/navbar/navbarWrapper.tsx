import { getServerSession } from "next-auth/next";
import Navbar from "./navbar";
// import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function NavbarWrapper() {
  // const session = await getServerSession(authOptions);
  // const session = await getServerSession();
  const session = null
  return (
    <>
      <Navbar session={session} />
    </>
  );
}
