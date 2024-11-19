"use client"

import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faSpinner, faTimes, faCheck, faXmark, faArrowDown, faArrowUp, faMoon, faSun } from "@fortawesome/free-solid-svg-icons"
import GuessCard from "src/app/_components/guessCard"
import Header from "src/app/_components/header";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Music, Play, Users, Award, Twitter, Headphones, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
  const [darkMode, setDarkMode] = useState(false) //TODO this is handled in navbar


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



  // if (isLoading) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-400 to-indigo-800 dark:from-gray-900 dark:to-indigo-900">
  //       <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-white" />
  //     </div>
  //   )
  // }

  return (
    <main className={`flex py-8 flex-col bg-gradient-to-b from-sky-400 to-indigo-800 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>

      <div className="flex flex-1 flex-col items-center justify-start gap-8 px-4 py-8">
        <Tabs defaultValue="daily" className="w-full max-w-4xl">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="daily">Daily Challenge</TabsTrigger>
            <TabsTrigger value="modes">Game Modes</TabsTrigger>
            <TabsTrigger value="multiplayer">Multiplayer</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-6">


            <div className="mt-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={gameState?.dailySongFound ? "Today's song found!" : "Search by artist or title"}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  disabled={gameState?.dailySongFound}
                  className={`h-12 w-full rounded-full pl-12 pr-4 text-base transition-all duration-300 ease-in-out ${
                    gameState?.dailySongFound
                      ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      : "border-indigo-300 bg-white text-gray-800 shadow-md hover:shadow-lg focus:border-indigo-500 focus:shadow-lg dark:border-indigo-600 dark:bg-gray-800 dark:text-white"
                  }`}
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl ${
                    gameState?.dailySongFound ? "text-gray-400" : "text-indigo-500 dark:text-indigo-400"
                  }`}
                />
                {!gameState?.dailySongFound && searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-lg" />
                  </button>
                )}
              </div>
            </div>

            <Card className="mt-6 bg-purple-600 text-white dark:bg-purple-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Music className="h-6 w-6" />
                  <h2 className="text-xl font-semibold">Mystery Song</h2>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <span>Artists:</span>
                    <span className="text-purple-300 dark:text-purple-200">Hidden</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Album:</span>
                    <span className="text-purple-300 dark:text-purple-200">Hidden</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Year:</span>
                    <span className="text-purple-300 dark:text-purple-200">Hidden</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Decade:</span>
                    <span className="text-purple-300 dark:text-purple-200">Hidden</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {dropdownVisible && searchTerm && (
              <Card className="absolute z-50 mt-1 w-full max-h-60 overflow-auto">
                <CardContent className="p-0">
                  {isSearching ? (
                    <div className="p-4 text-center">
                      <FontAwesomeIcon icon={faSpinner} spin /> Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <ul className="divide-y dark:divide-gray-700">
                      {searchResults.map((song) => (
                        <li
                          key={song.id}
                          className="flex cursor-pointer items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => handleDDSelect(song)}
                        >
                          <div>
                            <p className="font-medium">{song.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{song.artists[0].name}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">No results found</div>
                  )}
                </CardContent>
              </Card>
            )}

            {gameState && dailySong && (
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Your Guesses</h2>
                    <Badge variant="outline" className="text-lg">
                      {gameState.remainingGuesses} guesses remaining
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {gameState.pickedSongs.length > 0 ? (
                    <div className="space-y-4">
                      {gameState.pickedSongs.map((song, index) => (
                        <GuessCard key={song.id} guess={song} index={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No guesses yet. Start searching and guessing!</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                        Try to guess the song in as few attempts as possible.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="modes">
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
          </TabsContent>

          <TabsContent value="multiplayer">
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
          </TabsContent>
        </Tabs>
      </div>

      <section className="bg-white dark:bg-gray-800 py-12 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold dark:text-white">Features</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Play className="mb-4 h-12 w-12 text-indigo-500 dark:text-indigo-400" />
                <h3 className="mb-2 text-xl font-semibold">Daily Challenges</h3>
                <p className="text-gray-600 dark:text-gray-300">New song to guess every day. How fast can you identify it?</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Users className="mb-4 h-12 w-12 text-indigo-500 dark:text-indigo-400" />
                <h3 className="mb-2 text-xl font-semibold">Multiplayer Mode</h3>
                <p className="text-gray-600 dark:text-gray-300">Compete with friends in real-time. Who's the fastest music guru?</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Award className="mb-4 h-12 w-12 text-indigo-500 dark:text-indigo-400" />
                <h3 className="mb-2 text-xl font-semibold">Diverse Quizzes</h3>
                <p className="text-gray-600 dark:text-gray-300">From pop to classical, test your knowledge across all genres.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white/10 py-6 dark:bg-gray-800/10">
        <div className="container mx-auto flex flex-col items-center justify-between px-4 text-white sm:flex-row">
          <p className="text-sm">© 2024 MusicMaestro. All rights reserved.</p>
          <nav className="mt-4 flex gap-4 sm:mt-0">
            <Link href="#" className="text-sm hover:underline">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm hover:underline">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  )
}
