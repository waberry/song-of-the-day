"use client"

import React, { useState } from "react"
import Header from "../components/main/OldHeader"
import Footer from "../components/main/Footer"
import DailyChallenge from "../components/main/DailyChallenge"
import GameModes from "../components/modes/GameModes"
import { GenreSelector } from "../components/modes/GenreSelector"
import { ResponsiveTabs } from "../components/main/ResponsiveTabs"
import EnhancedGameHeader from "../components/main/Header"

export default function MainPage() {
  const [isGenreSelectorOpen, setIsGenreSelectorOpen] = useState(false)

  const tabs = [
    {
      value: "daily",
      label: "Daily Challenge",
      content: <EnhancedGameHeader />
    },
    {
      value: "modes",
      label: "Game Modes",
      content: (
        <>
          <GameModes onGenreSelect={() => setIsGenreSelectorOpen(true)} />
          <GenreSelector 
            isOpen={isGenreSelectorOpen} 
            onClose={() => setIsGenreSelectorOpen(false)} 
          />
        </>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      <main className="container mx-auto px-4 py-8">
        <ResponsiveTabs tabs={tabs} defaultValue="daily" />
        
        <div className="max-w-xl mx-auto">
          <input
            type="search"
            placeholder="Search for a song..."
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-white/50"
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}