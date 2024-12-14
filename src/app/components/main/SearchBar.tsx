"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Search, X } from 'lucide-react'

interface SearchInputProps {
  searchTerm: string
  gameState: {
    dailySongFound: boolean
  }
  handleSearch: (value: string) => void
  handleFocus: () => void
  handleBlur: () => void
}

export function SearchInput({
  searchTerm,
  gameState,
  handleSearch,
  handleFocus,
  handleBlur
}: SearchInputProps) {
  return (
    <div className="mt-6">
      <div className="relative">
        <Input
          type="text"
          placeholder={gameState.dailySongFound ? "Today's song found!" : "Search by artist or title"}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={gameState.dailySongFound}
          className={`h-12 w-full rounded-full pl-12 pr-4 text-base transition-all duration-300 ease-in-out ${
            gameState.dailySongFound
              ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
              : "border-indigo-300 bg-white text-gray-800 shadow-md hover:shadow-lg focus:border-indigo-500 focus:shadow-lg dark:border-indigo-600 dark:bg-gray-800 dark:text-white"
          }`}
        />
        <Search
          className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${
            gameState.dailySongFound ? "text-gray-400" : "text-indigo-500 dark:text-indigo-400"
          }`}
        />
        {!gameState.dailySongFound && searchTerm && (
          <button
            type="button"
            onClick={() => handleSearch("")}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </div>
    </div>
  )
}