"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useSpotify } from "~/app/contexts/spotifyContext";

interface NavLink {
  href: string;
  label: string;
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const { spotifyToken } = useSpotify();
  const navLinks: NavLink[] = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/history", label: "History" },
    { href: "/contact", label: "Contact Us" },
    { href: "/about", label: "About" },
  ];

  const handleSignIn = async () => {
    try {
      const result = await signIn("spotify", {
        callbackUrl: "/dashboard",
        redirect: false,
      });
      if (result?.error) {
        console.log("SIGNIN FAILED");
        console.error("Sign in error:", result.error);
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
    }
  };
  return (
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between bg-indigo-600 px-4 py-2 text-white shadow-md">
      <div className="flex w-1/2 items-center justify-start">
        <Link href="/" className="text-xl font-bold">
          SOD
        </Link>
      </div>

      <div className="flex w-1/2 items-center justify-end">
        <ul className="hidden space-x-4 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>

        <button className="focus:outline-none md:hidden">
          <FontAwesomeIcon icon={faBars} className="text-2xl" />
        </button>

        {status === "loading" ? (
          <span className="ml-4">Loading...</span>
        ) : session ? (
          <>
            <button
              onClick={() => signOut()}
              className="ml-4 rounded bg-pink-500 px-3 py-1 text-white hover:bg-pink-600"
            >
              Sign Out
            </button>
            {spotifyToken && (
              <span
                className="ml-4 max-w-xs truncate text-sm"
                title={spotifyToken}
              >
                {/* Token: {spotifyToken.substring(0, 10)}... */}
              </span>
            )}
          </>
        ) : (
          <button
            onClick={handleSignIn}
            className="ml-4 rounded bg-green-400 px-3 py-1 text-indigo-900 hover:bg-green-500"
          >
            Connect with Spotify
          </button>
        )}
      </div>
    </nav>
  );
}
