"use client"

import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faSpinner, faTimes, faCheck, faXmark, faArrowDown, faArrowUp, faFire } from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Music, Play, SkipForward } from "lucide-react"

// Mock functions for Classic Mode
const getRandomSong = async (): Promise<{
  id: string;
  name: string;
  artists: { name: string }[];
  genre: string;
  year: number;
}> => ({
  id: Math.random().toString(36).substr(2, 9),
  name: "Random Song",
  artists: [{ name: "Random Artist" }],
  genre: ["Pop", "Rock", "Hip-Hop", "Electronic"][Math.floor(Math.random() * 4)],
  year: 1970 + Math.floor(Math.random() * 53)
})

const searchTracks = async (term: string) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return [
    { id: "1", name: "Song 1", artists: [{ name: "Artist 1" }], album: { name: "Album 1", images: [{ url: "/placeholder.svg" }], release_date: "2023" }, genre: "Pop" },
    { id: "2", name: "Song 2", artists: [{ name: "Artist 2" }], album: { name: "Album 2", images: [{ url: "/placeholder.svg" }], release_date: "2022" }, genre: "Rock" },
    { id: "3", name: "Song 3", artists: [{ name: "Artist 3" }], album: { name: "Album 3", images: [{ url: "/placeholder.svg" }], release_date: "2021" }, genre: "Hip-Hop" },
  ].filter(song => song.name.toLowerCase().includes(term.toLowerCase()) || song.artists[0].name.toLowerCase().includes(term.toLowerCase()))
}

// Add proper typing to GuessCard component
interface GuessCardProps {
  guess: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
      name: string;
      images: { url: string }[];
      release_date: string;
    };
    genre: string;
  };
  currentSong: {
    name: string;
    artists: { name: string }[];
    genre: string;
    year: number;
  };
}

const GuessCard: React.FC<GuessCardProps> = ({ guess, currentSong }) => {
  const matchStatus = {
    nameMatch: guess.name.toLowerCase() === currentSong.name.toLowerCase(),
    artistMatch: guess.artists[0].name.toLowerCase() === currentSong.artists[0].name.toLowerCase(),
    yearDiff: currentSong.year - parseInt(guess.album.release_date),
    genreMatch: guess.genre.toLowerCase() === currentSong.genre.toLowerCase()
  }

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="font-semibold">{guess.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{guess.artists[0].name}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
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

// Add proper typing to ClassicMode component
export default function ClassicMode() {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [currentSong, setCurrentSong] = useState<Awaited<ReturnType<typeof getRandomSong>> | null>(null)
  const [guesses, setGuesses] = useState<typeof searchResults[0][]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [remainingGuesses, setRemainingGuesses] = useState(6)

  useEffect(() => {
    loadNewSong()
  }, [])

  const loadNewSong = async () => {
    try {
      setIsLoading(true)
      const newSong = await getRandomSong()
      setCurrentSong(newSong)
      setGuesses([])
      setRemainingGuesses(6)
    } catch (error) {
      console.error("Failed to load new song:", error)
      // Consider showing an error message to user
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      setIsSearching(true)
      const delayDebounceFn = setTimeout(async () => {
        try {
          const results = await searchTracks(searchTerm)
          setSearchResults(results)
        } catch (error) {
          console.error("Search failed:", error)
          // Consider showing an error message to user
        } finally {
          setIsSearching(false)
          setDropdownVisible(true)
        }
      }, 300)
      return () => clearTimeout(delayDebounceFn)
    } else {
      setDropdownVisible(false)
      setSearchResults([])
    }
  }, [searchTerm])

  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase())
  }

  const handleFocus = () => {
    if (searchTerm.trim() !== "") {
      setDropdownVisible(true)
    }
  }

  const handleBlur = () => {
    setTimeout(() => {
      setDropdownVisible(false)
    }, 200)
  }

  const handleGuess = (selectedSong) => {
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
        setTimeout(() => loadNewSong(), 2000) // Load new song after 2 seconds
      } else if (remainingGuesses === 1) {
        // Last guess and incorrect
        setStreak(0)
        setTimeout(() => loadNewSong(), 2000) // Load new song after 2 seconds
      }
    }
  }

  const handleSkip = () => {
    setStreak(0)
    loadNewSong()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
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
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by artist or title"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="h-12 w-full rounded-full pl-12 pr-4 text-base transition-all duration-300 ease-in-out border-indigo-300 bg-white text-gray-800 shadow-md hover:shadow-lg focus:border-indigo-500 focus:shadow-lg dark:border-indigo-600 dark:bg-gray-800 dark:text-white"
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
                    {searchResults.map((song) => (
                      <li
                        key={song.id}
                        className="flex cursor-pointer items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => handleGuess(song)}
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
  )
}