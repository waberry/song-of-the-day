import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { Music } from 'lucide-react'

interface HeaderProps {
  darkMode: boolean
  toggleDarkMode: () => void
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between px-4 lg:px-6">
      <Link href="/" className="flex items-center text-2xl font-bold text-white">
        <Music className="mr-2 h-6 w-6" />
        MusicMaestro
      </Link>
      <nav className="flex gap-4 sm:gap-6">
        <Link href="#" className="text-sm font-medium text-white hover:underline">
          How to Play
        </Link>
        <Link href="#" className="text-sm font-medium text-white hover:underline">
          Leaderboard
        </Link>
        <button
          onClick={toggleDarkMode}
          className="text-sm font-medium text-white hover:underline"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
        </button>
      </nav>
    </header>
  )
}