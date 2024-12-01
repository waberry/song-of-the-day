import React from 'react'
import Link from 'next/link'
import { Music } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t bg-white/10 py-6 dark:bg-gray-800/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <div className="flex flex-col items-center sm:items-start">
            <Link href="/" className="flex items-center text-xl font-bold text-white mb-2">
              <Music className="mr-2 h-5 w-5" />
              MusicMaestro
            </Link>
            <p className="text-sm text-center sm:text-left text-gray-300">© 2024 MusicMaestro. All rights reserved.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
              Home
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
              About
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
              How to Play
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
              Leaderboard
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}