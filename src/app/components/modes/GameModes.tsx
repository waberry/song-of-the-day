"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, Headphones, Tag, Clock, Trophy, Users } from "lucide-react"
import { motion } from "framer-motion"

interface GameMode {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  comingSoon?: boolean
}

const gameModes: GameMode[] = [
  {
    id: "genre",
    title: "Genre Challenge",
    description: "Guess songs from a specific music genre",
    icon: <Tag className="h-6 w-6" />,
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: "decade",
    title: "Decade Master",
    description: "Test your knowledge of music from different eras",
    icon: <Clock className="h-6 w-6" />,
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: "artist",
    title: "Artist Explorer",
    description: "Discover and guess songs from specific artists",
    icon: <Music className="h-6 w-6" />,
    color: "from-green-500 to-emerald-600"
  },
  {
    id: "multiplayer",
    title: "Multiplayer Battle",
    description: "Compete with friends in real-time",
    icon: <Users className="h-6 w-6" />,
    color: "from-orange-500 to-red-600",
    comingSoon: true
  }
]

interface GameModesProps {
  onGenreSelect: () => void
}

export default function GameModes({ onGenreSelect }: GameModesProps) {
  const handleModeSelect = (mode: GameMode) => {
    if (mode.comingSoon) {
      // Show coming soon toast/notification
      return
    }

    // Handle mode selection
    switch (mode.id) {
      case "genre":
        onGenreSelect()
        break
      case "decade":
        // Open decade selection modal
        break
      case "artist":
        // Open artist search/selection
        break
    }
  }

  return (
    <div className="grid gap-6 p-4 md:grid-cols-2 lg:grid-cols-2">
      {gameModes.map((mode, index) => (
        <motion.div
          key={mode.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card 
            className={`relative overflow-hidden cursor-pointer transition-transform hover:scale-105 ${
              mode.comingSoon ? 'opacity-75' : ''
            }`}
            onClick={() => handleModeSelect(mode)}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${mode.color} opacity-10`} />
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">{mode.title}</CardTitle>
                <div className={`p-2 rounded-full bg-gradient-to-r ${mode.color}`}>
                  {mode.icon}
                </div>
              </div>
              <CardDescription>{mode.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {mode.comingSoon && (
                <span className="inline-block px-2 py-1 text-sm font-semibold text-white bg-gray-500 rounded-full">
                  Coming Soon
                </span>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
} 