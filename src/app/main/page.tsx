"use client"

import React, { useState } from "react"
import Header from "../_components/main/Header"
import Footer from "../_components/main/Footer"
import DailyChallenge from "../_components/main/DailyChallenge"
import GameModes from "../_components/modes/GameModes"
import { GenreSelector } from "../_components/modes/GenreSelector"
import { ResponsiveTabs } from "../_components/main/ResponsiveTabs"

export default function MainPage() {
  const [isGenreSelectorOpen, setIsGenreSelectorOpen] = useState(false)

  const tabs = [
    {
      value: "daily",
      label: "Daily Challenge",
      content: <DailyChallenge />
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
      </main>
      <Footer />
    </div>
  )
}