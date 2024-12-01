"use client"

import React, { useState } from "react"
import Header from "../_components/main/Header"
import Footer from "../_components/main/Footer"
import DailyChallenge from "../_components/main/DailyChallenge"
import GameModes from "../_components/modes/GameModes"
import { GenreSelector } from "../_components/modes/GenreSelector"
import { ResponsiveTabs } from "../_components/main/ResponsiveTabs"
import EnhancedGameHeader from "../_components/main/header"

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
      <Header darkMode={true} toggleDarkMode={() => {}} />
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