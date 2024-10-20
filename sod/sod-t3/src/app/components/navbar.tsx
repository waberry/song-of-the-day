"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSpotify } from "~/app/contexts/spotifyContext";
import { Menu, X, Music, Home, BarChart2, Info } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const { spotifyToken } = useSpotify();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks: NavLink[] = [
    { href: "/landingpage", label: "Game", icon: <Home size={20} /> },
    { href: "/dashboard", label: "Dashboard", icon: <BarChart2 size={20} /> },
    { href: "/about", label: "About", icon: <Info size={20} /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-indigo-600 shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0" aria-label="Home">
              <Image
                src="/images/simpleLogo.png"
                alt="Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white hover:bg-indigo-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200"
                >
                  {link.icon}
                  <span className="ml-2">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            {status === "loading" ? (
              <span className="text-white">Loading...</span>
            ) : session ? (
              <button
                onClick={() => signOut()}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="bg-green-400 hover:bg-green-500 text-indigo-900 px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200"
              >
                <Music size={20} className="mr-2" />
                Connect with Spotify
              </button>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white hover:bg-indigo-500 hover:bg-opacity-75 block px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              {link.icon}
              <span className="ml-2">{link.label}</span>
            </Link>
          ))}
          {status !== "loading" && (
            <div className="mt-4">
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="w-full bg-green-400 hover:bg-green-500 text-indigo-900 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center"
                >
                  <Music size={20} className="mr-2" />
                  Connect with Spotify
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}