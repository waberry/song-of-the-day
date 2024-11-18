"use client"

import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faSpinner, faTimes, faCheck, faXmark, faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons"
import { Button } from "src/components/ui/button"
import { Input } from "src/components/ui/input"
import { Card, CardContent, CardHeader } from "src/components/ui/card"
import { Badge } from "src/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "src/components/ui/tabs"
import { Music, Play, Users, Award, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Enhanced mock functions
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

const GuessCard = ({ guess, index }) => {
  const { matchStatus } = guess

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-semibold">
              {index + 1}
            </span>
            <div>
              <h3 className="font-semibold">{guess.name}</h3>
              <p className="text-sm text-gray-600">{guess.artists[0].name}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Badge variant={matchStatus.nameMatch ? "success" : "destructive"}>
              <FontAwesomeIcon icon={matchStatus.nameMatch ? faCheck : faXmark} className="mr-1" />
              Title
            </Badge>
            <Badge variant={matchStatus.artistMatch ? "success" : "destructive"}>
              <FontAwesomeIcon icon={matchStatus.artistMatch ? faCheck : faXmark} className="mr-1" />
              Artist
            </Badge>
            <Badge variant={matchStatus.genreMatch ? "success" : "destructive"}>
              <FontAwesomeIcon icon={matchStatus.genreMatch ? faCheck : faXmark} className="mr-1" />
              Genre
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <FontAwesomeIcon
                icon={matchStatus.yearDiff > 0 ? faArrowDown : faArrowUp}
                className="mr-1 text-indigo-500"
              />
              {Math.abs(matchStatus.yearDiff)} year{Math.abs(matchStatus.yearDiff) !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LandingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [gameState, setGameState] = useState(null)
  const [dailySong, setDailySong] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-400 to-indigo-800">
        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-white" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-400 to-indigo-800">
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
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-start gap-8 px-4 py-8">
        <Tabs defaultValue="daily" className="w-full max-w-3xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">Daily Challenge</TabsTrigger>
            <TabsTrigger value="multiplayer">Multiplayer</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-6">
            <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
              <CardContent className="flex flex-col items-center space-y-6 p-8">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  What is the <span className="flex justify-center gap-1 py-2">
                    <span className="inline-block rounded bg-sky-400 px-3 py-1">S</span>
                    <span className="inline-block rounded bg-sky-400 px-3 py-1">O</span>
                    <span className="inline-block rounded bg-sky-400 px-3 py-1">N</span>
                    <span className="inline-block rounded bg-sky-400 px-3 py-1">G</span>
                  </span> of the day?
                </h1>
                <p className="text-xl">The song of the day is hidden. Can you guess it?</p>
                <p className="text-lg">Attempts: {gameState.remainingGuesses}</p>
                <p>Use the search box below to make your guess!</p>
                <Button variant="secondary" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  Share Progress
                </Button>
              </CardContent>
            </Card>

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
                      ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
                      : "border-indigo-300 bg-white text-gray-800 shadow-md hover:shadow-lg focus:border-indigo-500 focus:shadow-lg"
                  }`}
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl ${
                    gameState?.dailySongFound ? "text-gray-400" : "text-indigo-500"
                  }`}
                />
                {!gameState?.dailySongFound && searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-lg" />
                  </button>
                )}
              </div>
            </div>

            <Card className="mt-6 bg-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Music className="h-6 w-6" />
                  <h2 className="text-xl font-semibold">Mystery Song</h2>
                </div>
                <div className="mt-4 grid gap-4">
                  <div className="flex items-center justify-between">
                    <span>artists:</span>
                    <span className="text-purple-300">Hidden</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>album:</span>
                    <span className="text-purple-300">Hidden</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>year:</span>
                    <span className="text-purple-300">Hidden</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>decade:</span>
                    <span className="text-purple-300">Hidden</span>
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
                    <ul className="divide-y">
                      {searchResults.map((song) => (
                        <li
                          key={song.id}
                          className="flex cursor-pointer items-center p-4 hover:bg-gray-50"
                          onClick={() => handleDDSelect(song)}
                        >
                          <div>
                            <p className="font-medium">{song.name}</p>
                            <p className="text-sm text-gray-500">{song.artists[0].name}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-gray-500">No results found</div>
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
                      <p className="text-gray-500">No guesses yet. Start searching and guessing!</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Try to guess the song in as few attempts as possible.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="multiplayer">
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Users className="h-12 w-12 text-purple-600" />
                <h2 className="text-2xl font-bold">Multiplayer Mode</h2>
                <p className="text-center text-gray-600">
                  Challenge your friends in real-time! Create a room or join an existing one to compete.
                </p>
                <div className="flex gap-4">
                  <Button>Create Room</Button>
                  <Button variant="outline">Join Room</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <section className="bg-white py-12 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Features</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Play className="mb-4 h-12 w-12 text-indigo-500" />
                <h3 className="mb-2 text-xl font-semibold">Daily Challenges</h3>
                <p className="text-gray-600">New song to guess every day. How fast can you identify it?</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Users className="mb-4 h-12 w-12 text-indigo-500" />
                <h3 className="mb-2 text-xl font-semibold">Multiplayer Mode</h3>
                <p className="text-gray-600">Compete with friends in real-time. Who's the fastest music guru?</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Award className="mb-4 h-12 w-12 text-indigo-500" />
                <h3 className="mb-2 text-xl font-semibold">Diverse Quizzes</h3>
                <p className="text-gray-600">From pop to classical, test your knowledge across all genres.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white/10 py-6">
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
    </div>
  )
}
