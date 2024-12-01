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

// Add interface for search result songs
interface SearchResultSong {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
    release_date: string;
  };
  genre: string;
}

// Add proper typing to ClassicMode component
export default function ClassicMode() {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [gameState, setGameState] = useState(null)
  const [dailySong, setDailySong] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<SearchResultSong[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [remainingGuesses, setRemainingGuesses] = useState(6)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [selectedIndex, setSelectedIndex] = useState(-1)

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

  const handleSearch = (value: string) => {
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

  const handleGuess = (selectedSong: SearchResultSong) => {
    if (remainingGuesses > 0) {
      setGuesses([selectedSong, ...guesses])
      setRemainingGuesses(remainingGuesses - 1)
      setDropdownVisible(false)
      setSearchTerm("")

      if (selectedSong.name.toLowerCase() === currentSong.name.toLowerCase() &&
          selectedSong.artists[0].name.toLowerCase() === currentSong.artists[0].name.toLowerCase()) {
        // Correct guess
        setStreak(streak + 1)
        setMaxStreak(Math.max(maxStreak, streak + 1))
        setNotification({
          type: 'success',
          message: 'Correct! Loading next song...'
        })
        setTimeout(() => {
          loadNewSong()
          setNotification({ type: null, message: '' })
        }, 2000)
      } else if (remainingGuesses === 1) {
        // Last guess and incorrect
        setStreak(0)
        setNotification({
          type: 'error',
          message: `Game Over! The song was "${currentSong.name}" by ${currentSong.artists[0].name}`
        })
        setTimeout(() => {
          loadNewSong()
          setNotification({ type: null, message: '' })
        }, 2000)
      }
    }
  }

  const handleSkip = () => {
    setStreak(0)
    loadNewSong()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!dropdownVisible || searchResults.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleGuess(searchResults[selectedIndex])
        }
        break
      case 'Escape':
        setDropdownVisible(false)
        setSelectedIndex(-1)
        break
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-400 to-indigo-800">
        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-white" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block w-64">
        {/* Ad content */}
      </div>

      <div className="flex-1 max-w-4xl mx-auto px-4 py-8">
        {notification.type && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {notification.message}
          </div>
        )}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Classic Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faFire} className="text-orange-500 mr-2" />
                <span className="font-semibold">Streak: {streak}</span>
              </div>
              <div>
                <span className="font-semibold">Max Streak: {maxStreak}</span>
              </div>
            </div>
            <Progress value={(6 - remainingGuesses) / 6 * 100} className="mb-4" />
            <p className="text-center mb-4">Guesses remaining: {remainingGuesses}</p>
            <div className="relative w-full max-w-2xl mx-auto">
              <Input
                type="text"
                placeholder="Search by artist or title"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="h-12 w-full rounded-full pl-12 pr-4 text-base transition-all duration-300 ease-in-out border-indigo-300 bg-white text-gray-800 shadow-md hover:shadow-lg focus:border-indigo-500 focus:shadow-lg dark:border-indigo-600 dark:bg-gray-800 dark:text-white sm:text-base md:text-lg"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-indigo-500 dark:text-indigo-400"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-lg" />
                </button>
              )}
            </div>

            {dropdownVisible && searchTerm && (
              <Card className="absolute z-50 mt-1 w-full max-h-60 overflow-auto">
                <CardContent className="p-0">
                  {isSearching ? (
                    <div className="p-4 text-center">
                      <FontAwesomeIcon icon={faSpinner} spin /> Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <ul className="divide-y dark:divide-gray-700">
                      {searchResults.map((song, index) => (
                        <li
                          key={song.id}
                          className={`flex cursor-pointer items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                            index === selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
                          }`}
                          onClick={() => handleGuess(song)}
                          onMouseEnter={() => setSelectedIndex(index)}
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
          </CardContent>
        </Card>

        <Card className="mb-6 bg-purple-600 text-white dark:bg-purple-800">
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
                <span>Genre:</span>
                <span className="text-purple-300 dark:text-purple-200">Hidden</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Year:</span>
                <span className="text-purple-300 dark:text-purple-200">Hidden</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Decade:</span>
                <span className="text-purple-300 dark:text-purple-200">{Math.floor(currentSong.year / 10) * 10}s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {guesses.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Guesses</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {guesses.map((guess, index) => (
                  <GuessCard key={index} guess={guess} currentSong={currentSong} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center space-x-4">
          <Button onClick={handleSkip} variant="outline" className="flex items-center">
            <SkipForward className="mr-2 h-4 w-4" />
            Skip Song
          </Button>
          <Button onClick={loadNewSong} className="flex items-center">
            <Play className="mr-2 h-4 w-4" />
            New Song
          </Button>
        </div>
      </div>

      <div className="hidden lg:block w-64">
        {/* Ad content */}
      </div>
    </div>
  )
}
