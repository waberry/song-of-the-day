"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Headphones, Zap, Award, Users } from 'lucide-react'
import Header from "../_components/main/Header"
import Footer from "../_components/main/Footer"
import DailyChallenge from "../_components/main/DailyChallenge"
import { ResponsiveTabs } from "../_components/main/ResponsiveTabs"
import { SearchInput } from "../_components/main/SearchBar"
import SongComparisonTable from "../_components/main/SongComparisonTable"
import LoadingScreen from "../_components/loadingScreens/loadingScreen"


// Enhanced mock functions (unchanged)
const getGameState = async () => ({ 
  dailySongFound: false, 
  pickedSongs: [
    { 
      id: "1", 
      name: "Bohemian Rhapsody", 
      artists: [{ name: "Queen" }],
      album: { name: "A Night at the Opera", images: [{ url: "/placeholder.svg" }] },
      matchStatus: {
        nameMatch: false,
        artistMatch: false,
        yearDiff: 1,
        genreMatch: true
      }
    }
  ],
  remainingGuesses: 5
})

const getDailySong = async () => ({ 
  id: "daily", 
  name: "Daily Song", 
  artists: [{ name: "Artist" }],
  genre: "Rock",
  year: 1975
})

const searchTracks = async (term) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return [
    { id: "1", name: "Song 1", artists: [{ name: "Artist 1" }], album: { name: "Album 1", images: [{ url: "/placeholder.svg" }], release_date: "2023" }, genre: "Pop" },
    { id: "2", name: "Song 2", artists: [{ name: "Artist 2" }], album: { name: "Album 2", images: [{ url: "/placeholder.svg" }], release_date: "2022" }, genre: "Rock" },
    { id: "3", name: "Song 3", artists: [{ name: "Artist 3" }], album: { name: "Album 3", images: [{ url: "/placeholder.svg" }], release_date: "2021" }, genre: "Hip-Hop" },
  ].filter(song => song.name.toLowerCase().includes(term.toLowerCase()) || song.artists[0].name.toLowerCase().includes(term.toLowerCase()))
}

export default function LandingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [gameState, setGameState] = useState(null)
  const [dailySong, setDailySong] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    async function initializeGameState() {
      try {
        setIsLoading(true)
        const currentGameState = await getGameState()
        setGameState(currentGameState)
        const fetchedDailySong = await getDailySong()
        setDailySong(fetchedDailySong)
        setIsLoading(false)
      } catch (err) {
        console.error("Initialization error:", err)
        setIsLoading(false)
      }
    }
    initializeGameState()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      setIsSearching(true)
      const delayDebounceFn = setTimeout(async () => {
        const results = await searchTracks(searchTerm)
        setSearchResults(results)
        setIsSearching(false)
        setDropdownVisible(true)
      }, 300)
      return () => clearTimeout(delayDebounceFn)
    } else {
      setDropdownVisible(false)
      setSearchResults([])
    }
  }, [searchTerm])

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  const handleSearch = (value) => {
    if (gameState?.dailySongFound) return
    setSearchTerm(value.toLowerCase())
  }

  const handleFocus = () => {
    if (gameState?.dailySongFound) return
    if (searchTerm.trim() !== "") {
      setDropdownVisible(true)
    }
  }

  const handleBlur = () => {
    setTimeout(() => {
      setDropdownVisible(false)
    }, 200)
  }

  const handleDDSelect = (selectedSong) => {
    // Implement song selection logic here
    console.log("Selected song:", selectedSong)
    setDropdownVisible(false)
    setSearchTerm("")
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const DailyChallengeContent = (
    <DailyChallenge
      gameState={gameState}
      dailySong={dailySong}
      searchTerm={searchTerm}
      handleSearch={handleSearch}
      handleFocus={handleFocus}
      handleBlur={handleBlur}
      dropdownVisible={dropdownVisible}
      isSearching={isSearching}
      searchResults={searchResults}
      handleDDSelect={handleDDSelect}
    />
  )

  const GameModesContent = (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardContent className="flex flex-col items-center space-y-4 p-6">
          <Headphones className="h-12 w-12 text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold">Classic Mode</h2>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Guess the song from a short audio clip. Test your ear for music!
          </p>
          <Button>Play Classic</Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col items-center space-y-4 p-6">
          <Zap className="h-12 w-12 text-yellow-500" />
          <h2 className="text-2xl font-bold">Lightning Round</h2>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Rapid-fire questions. How many can you answer in 60 seconds?
          </p>
          <Button>Start Lightning Round</Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col items-center space-y-4 p-6">
          <Award className="h-12 w-12 text-green-500" />
          <h2 className="text-2xl font-bold">Genre Master</h2>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Specialized quizzes for different music genres. Prove your expertise!
          </p>
          <Button>Choose Genre</Button>
        </CardContent>
      </Card>
    </div>
  )

  const MultiplayerContent = (
    <Card>
      <CardContent className="flex flex-col items-center space-y-4 p-6">
        <Users className="h-12 w-12 text-purple-600 dark:text-purple-400" />
        <h2 className="text-2xl font-bold">Multiplayer Mode</h2>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Challenge your friends in real-time! Create a room or join an existing one to compete.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button>Create Room</Button>
          <Button variant="outline">Join Room</Button>
        </div>
      </CardContent>
    </Card>
  )

  const tabs = [
    { value: "daily", label: "Daily Challenge", content: DailyChallengeContent },
    { value: "modes", label: "Game Modes", content: GameModesContent },
    { value: "multiplayer", label: "Multiplayer", content: MultiplayerContent },
  ]

  if (isLoading) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <div className={`flex min-h-screen flex-col bg-gradient-to-b from-sky-400 to-indigo-800 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> */}

      <main className="flex flex-1 flex-col gap-4 px-4 py-8">
        <ResponsiveTabs tabs={tabs} />
      
        <SearchInput
          searchTerm={searchTerm}
          gameState={gameState}
          handleSearch={handleSearch}
          handleFocus={handleFocus}
          handleBlur={handleBlur}
        />
        {gameState && dailySong ? (
          <div className="relative z-0 w-full">
            <SongComparisonTable gameState={gameState} dailySong={dailySong} />
          </div>
        ) : (
          <div className="text-center text-white">
            <p>Unable to load game data. Please try refreshing the page.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}