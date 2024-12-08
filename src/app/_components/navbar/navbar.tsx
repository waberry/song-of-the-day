"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Music, BarChart2, Info, Sun, Moon } from 'lucide-react';
import { signIn, signOut, useSession } from "next-auth/react";

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { data: session, status } = useSession();

  const navLinks: NavLink[] = [
    { href: "/main", label: "Classic", icon: <Music size={20} /> },
    { href: "/leaderboard", label: "Leaderboard", icon: <BarChart2 size={20} /> },
    { href: "/about", label: "About", icon: <Info size={20} /> },
  ];

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleSignIn = async () => {
    await signIn("spotify", { callbackUrl: "/main" });
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-md' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-2xl font-bold text-indigo-600 dark:text-white">
              <Music className="mr-2 h-6 w-6" />
              {/* TODO: add logo here */}
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200"
                >
                  {link.icon}
                  <span className="ml-2">{link.label}</span>
                </Link>
              ))}
              <button
                onClick={toggleDarkMode}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 p-2 rounded-md transition-colors duration-200"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {status === "loading" ? (
                <span className="text-gray-700 dark:text-gray-300">Loading...</span>
              ) : session ? (
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  aria-label="Sign out"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="bg-[#1DB954] hover:bg-[#1ed760] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200"
                  aria-label="Connect with Spotify"
                >
                  <Music size={20} className="mr-2" />
                  Connect with Spotify
                </button>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 block px-3 py-2 rounded-md text-base font-medium flex items-center transition-colors duration-200"
            >
              {link.icon}
              <span className="ml-2">{link.label}</span>
            </Link>
          ))}
          <button
            onClick={toggleDarkMode}
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 w-full px-3 py-2 rounded-md text-base font-medium flex items-center transition-colors duration-200"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={20} className="mr-2" /> : <Moon size={20} className="mr-2" />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          {status !== "loading" && (
            <div className="mt-4">
              {session ? (
                <button
                  onClick={handleSignOut}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  aria-label="Sign out"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center transition-colors duration-200"
                  aria-label="Connect with Spotify"
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