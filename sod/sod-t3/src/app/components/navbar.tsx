"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useSpotify } from "~/app/contexts/spotifyContext";
import { useState } from "react";

interface NavLink {
  href: string;
  label: string;
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const { spotifyToken } = useSpotify();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        console.error("Sign in error:", result.error);
        alert("Failed to sign in. Please try again.");
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      alert("Unexpected error. Please try again later.");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-indigo-600 text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-2">
        <Link href="/" className="text-xl font-bold" aria-label="Home">
          <Image
            src="/sod-t3/public/simpleLogo.png"
            alt=""
            width={150} // Adjust width as needed
            height={40} // Adjust height as needed
            className="object-contain"
          />
        </Link>
        <button
          onClick={toggleMobileMenu}
          className="md:hidden focus:outline-none"
          aria-label="Toggle navigation"
        >
          <FontAwesomeIcon icon={faBars} className="text-2xl" />
        </button>
        <div className={`md:flex md:items-center md:space-x-4 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col md:flex-row">
            {navLinks.map((link) => (
              <li key={link.href} className="md:ml-4">
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center ml-4">
            {status === "loading" ? (
              <span>Loading...</span>
            ) : session ? (
              <>
                <button
                  onClick={() => signOut()}
                  className="rounded bg-pink-500 px-3 py-1 text-white hover:bg-pink-600"
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
                className="rounded bg-green-400 px-3 py-1 text-indigo-900 hover:bg-green-500"
              >
                Connect with Spotify
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
